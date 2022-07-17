const express = require('express')

const path = require('path')
const request = require('request')

const app = express()

// Connect to database
//connectDB();

// Init Middleware
app.use(express.json({ extended: false }))
app.use(express.static(__dirname + '/public'))

const config = require('./config/db')
const { Connection, Request } = require('tedious')

var mqtt = require('mqtt')

var options = {
  clientId: 'test1',
  username: 'mqttlogin',
  password: 'mqttpass',
  clean: false,
  connectTimeout: 4000,
}

var client = mqtt.connect('mqtt://178.54.99.45:1883', options)

client.on('connect', function () {
  //console.log('connected');
  client.subscribe('monitor/#', { rh: true }, function (err) {
    if (err) {
      console.log(err)
    }
  })
})

var MqttMessageList = []
var LastUpdateList = []

getMqttStationList()
setInterval(() => getMqttStationList(), 35000)
setInterval(() => getMqttMessageList(), 10000)
//setInterval(() => console.log(MqttMessageList), 20000);
setInterval(() => serverMessageCountCheck(100), 10000)

//setInterval(() => console.log(MqttMessageList), 1000);

var workingStatus = 0

setInterval(() => checkWorkingStatus(), 10000)

setInterval(() => (workingStatus == 1 ? getMeasurementsBot() : {}), 120000)

// 2 minutes = 120000

var measurmentList = [
  'Si7021_temp',
  'BME280_press',
  'CCS811_eCO2',
  'CCS811_TVOC',
  'Si7021_hum',
  'GP2Y10_dust',
]
var measurmentUnitId = {
  Si7021_temp: 6,
  BME280_press: 5,
  CCS811_eCO2: 7,
  CCS811_TVOC: 8,
  Si7021_hum: 1,
  GP2Y10_dust: 4,
}
var currentParametrCount = 0
var tempMeasurment = {}

var lastTopic = ''

var lastUpdate = new Date()
client.on('message', function (topic, message) {
  // message is Buffer
  if (lastTopic != topic.toString()) {
    insertServerMessage(topic.toString(), message.toString())
    //console.log(topic.toString());
    //console.log(message.toString());
  } else {
    lastTopic = topic.toString()
  }

  if (topic.toString().includes('dev01')) {
    //console.log(topic.toString());
    //console.log(message.toString());
  }

  // Do your operations

  MqttMessageList.forEach((station) => {
    if (
      topic.toString() == station.measurmentList[station.currentParametrCount]
    ) {
      //console.log(`Topic match: ${topic.toString()} == ${station.measurmentList[station.currentParametrCount]}`);

      station.tempMeasurment[
        station.measurmentList[station.currentParametrCount]
      ] = message.toString()
      station.currentParametrCount++
      //console.log(station);
    }
  })

  var stationsChecked = 0
  var currentDate = new Date()
  var seconds = (currentDate.getTime() - lastUpdate.getTime()) / 1000
  //console.log(`Seconds: ${seconds}`);
  MqttMessageList.forEach((station) => {
    if (seconds >= 110) {
      if (station.isChecked == false) {
        console.log(station.tempMeasurment)
        if (
          station.currentParametrCount >= station.measurmentList.length &&
          workingStatus == 1
        )
          writeMeasurmentMQTT(
            station.ID_Station,
            station.tempMeasurment,
            station.measurmentUnitId
          )
        station.tempMeasurment = {}
        station.currentParametrCount = 0
        station.isChecked = true
        stationsChecked++
        //console.log(`Current Station: ${station.ID_Station}`);
        //console.log(`Checked: ${stationsChecked} from ${MqttMessageList.length}`);
      }
    }
    if (stationsChecked >= MqttMessageList.length) {
      lastUpdate = new Date()
      stationsChecked = 0
    }
  })
  MqttMessageList.forEach((station) => {
    station.isChecked = false
  })
})

// MQTT all Measurments write
async function writeMeasurmentMQTT(ID_Station, measurments, ID_Unit_List) {
  for (var key in measurments) {
    let ID_Unit = ID_Unit_List[key]
    let value = measurments[key]
    await writeOneMeasurment(ID_Station, value, ID_Unit)
  }
}

// MQTT one Measurment write
async function writeOneMeasurment(ID_Station, value, ID_Unit) {
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    sqlRequest = new Request(
      `insert into Measurment(Value, ID_Station, ID_Measured_Unit) values( ${value}, '${ID_Station}', ${ID_Unit})`,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
        }
      }
    )
    connection.execSql(sqlRequest)
  })
}

var saveEcoBotMeasurmentUnitId = {
  Humidity: 1,
  PM10: 2,
  'PM2.5': 3,
  Temperature: 6,
  'Air Quality Index': 9,
  Pressure: 5,
}

async function getMeasurementsBot() {
  var stationsID = []
  var stationsInfo = []
  var stationsIDtoEcoID = []
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    let sqlRequest = new Request(
      "select ID_Station, ID_SaveEcoBot from Station where Status = 'enabled' AND ID_SaveEcoBot IS NOT NULL",
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
        } else {
          //console.log(stationsID);

          request(
            'https://api.saveecobot.com/output.json',
            { json: true },
            function (error, response, body) {
              console.error('error:', error) // Print the error if one occurred
              console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received

              body.forEach((station) => {
                if (stationsID.includes(station.id)) {
                  stationsInfo.push(station)
                }
              })

              //console.log(stationsID);
              console.log(stationsIDtoEcoID)

              stationsInfo.forEach((station) => {
                let tempStationID = stationsIDtoEcoID.find(
                  (element) => element.ID_SaveEcoBot == station.id
                )
                station.pollutants.forEach((measurment) => {
                  let unitID = saveEcoBotMeasurmentUnitId[measurment.pol]
                  writeOneMeasurment(
                    tempStationID.ID_Station,
                    measurment.value,
                    unitID
                  )
                })
              })
            }
          )
        }
      }
    )
    sqlRequest.on('row', (columns) => {
      var tempRowObject = {}
      columns.forEach((column) => {
        tempRowObject[column.metadata.colName] = column.value
        if (column.metadata.colName == 'ID_SaveEcoBot') {
          stationsID.push(column.value)
        }
      })
      stationsIDtoEcoID.push(tempRowObject)
    })
    connection.execSql(sqlRequest)
  })
}

async function checkWorkingStatus() {
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    var all = []
    sqlRequest = new Request(
      'select Working_Status from System_Configuration where Configuration_ID = 1;',
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
        } else {
          //console.log(`status: ${workingStatus}`);
        }
      }
    )
    sqlRequest.on('row', (columns) => {
      workingStatus = columns[0].value
    })
    connection.execSql(sqlRequest)
  })
}

async function getMqttStationList() {
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    var all = []
    sqlRequest = new Request(
      "select ID_Station from Station where ID_Station like '1%';",
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
        } else {
          //console.log(`status: ${workingStatus}`);
        }
      }
    )
    sqlRequest.on('row', (columns) => {
      if (!checkStation(MqttMessageList, columns[0].value)) {
        MqttMessageList.push({
          ID_Station: columns[0].value,
          measurmentList: [],
          measurmentUnitId: {},
          currentParametrCount: 0,
          tempMeasurment: {},
          isChecked: false,
        })
      }
    })
    connection.execSql(sqlRequest)
  })
}

async function getMqttMessageList() {
  MqttMessageList.forEach((station) => {
    getMessagesForOneStation(station.ID_Station)
  })
}

async function getMessagesForOneStation(ID_Station) {
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    MqttMessageList.forEach((station) => {
      if (station.ID_Station == ID_Station) {
        station.measurmentList = []
        station.measurmentUnitId = {}
      }
    })
    sqlRequest = new Request(
      `select Message, ID_Measured_Unit from MQTT_Message_Unit where ID_Station = '${ID_Station}' order by Queue_Number`,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
        } else {
        }
      }
    )
    sqlRequest.on('row', (columns) => {
      if (checkStation(MqttMessageList, ID_Station)) {
        MqttMessageList.forEach((station) => {
          if (station.ID_Station == ID_Station) {
            station.measurmentUnitId[`${columns[0].value}`] = columns[1].value
            station.measurmentList.push(columns[0].value)
          }
        })
      }
    })
    connection.execSql(sqlRequest)
  })
}

async function insertServerMessage(Topic, Value) {
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    sqlRequest = new Request(
      `INSERT INTO Server_Message(Topic, Value) VALUES ('${Topic}', '${Value}');`,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
        } else {
          //console.log(`status: ${workingStatus}`);
        }
      }
    )
    connection.execSql(sqlRequest)
  })
}

async function serverMessageCountCheck(count) {
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    sqlRequest = new Request(
      `if (select count(Message_Date) from Server_Message) > 300
        delete from Server_Message
        where Message_Date in (
        select TOP(${count}) Message_Date
        from Server_Message
        order by Message_Date
        );`,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
        } else {
          //console.log(`status: ${workingStatus}`);
        }
      }
    )
    connection.execSql(sqlRequest)
  })
}

//[ {ID_Station: '1001', measurmentList: [], measurmentUnitId: []}, {}];

function checkStation(stations, ID_Station) {
  let find = false
  if (stations.length > 0) {
    stations.forEach((station) => {
      if (station.ID_Station == ID_Station) {
        find = true
      }
    })
    return find
  } else {
    return false
  }
}

client.on('error', function (error) {
  console.log("Can't connect" + error)
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header(
    'Access-Control-Allow-Headers',
    (value = 'Origin, Content-Type, x-auth-token')
  )
  next()
})

app.use('/server', require('./routes/api/serverMQTT'))
app.use('/station', require('./routes/api/station'))
app.use('/admin', require('./routes/api/admin'))
app.use('/auth', require('./routes/api/auth'))

app.get('/', (req, res) => {})

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

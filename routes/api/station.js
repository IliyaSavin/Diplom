const express = require('express')
const router = express.Router()
const config = require('../../config/db')
const { Connection, Request } = require('tedious')
const requestToAPI = require('request')
const auth = require('../../middleware/auth')
const e = require('express')
//const { request } = require('express');

const API_KEY = 'rxIB0ij87E3nkleJ3IHQ2eprdx98tOVV'

router.post('/addStationEcoBot', auth, async (req, res) => {
  const { id_SaveEcoBot } = req.body

  requestToAPI(
    'https://api.saveecobot.com/output.json',
    { json: true },
    function (error, response, body) {
      body.forEach((station) => {
        if (station.id == id_SaveEcoBot) {
          var connection = new Connection(config.ecoSensors)
          connection.connect()
          connection.on('connect', function (err) {
            request = new Request(
              `IF NOT EXISTS (SELECT * FROM Station WHERE ID_SaveEcoBot = '${station.id}') 
                                            BEGIN
                                            EXEC Add_Station @city = '${station.cityName}',
                                                    @name = '${station.stationName}',
                                                    @id_SaveEcoBot = '${station.id}',
                                                    @longitude = ${station.longitude},
                                                    @latitude = ${station.latitude}
                                            END`,
              function (err, rowCount, rows) {
                connection.close()
                if (err) {
                  console.log(err)
                  res.status(500).send('Server error')
                } else {
                  console.log('ok')
                  res.json({ msg: 'Station added' })
                }
              }
            )
            connection.execSql(request)
          })
        }
      })
    }
  )
})

router.post('/addStation', auth, async (req, res) => {
  const { city, name, id_server, longitude, latitude } = req.body
  var row = {}
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    request = new Request(
      `EXEC Add_Station @city = '${city}',
                                @name = '${name}',
                                @id_server = '${id_server}',
                                @longitude = ${longitude},
                                @latitude = ${latitude};
                                select TOP(1) * from Station where ID_Server = 1 ORDER BY ID_Station DESC;`,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
          res.status(500).send('Server error')
        } else {
          res.json(row)
        }
      }
    )
    request.on('row', (columns) => {
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value
      })
    })
    connection.execSql(request)
  })
})

router.post('/changeMessageUnit', auth, async (req, res) => {
  const { ID_Station, ID_Measured_Unit, Message, Queue_Number } = req.body

  var all = []
  var messageStr = ''
  var queueStr = ''

  if (Message) {
    messageStr = `Message = '${Message}'`
  }
  if (Queue_Number) {
    if (messageStr != '') {
      queueStr = `, Queue_Number = ${Queue_Number}`
    } else {
      queueStr = `Queue_Number = ${Queue_Number}`
    }
  }

  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    request = new Request(
      `if exists (select * from MQTT_Message_Unit where ID_Station = '${ID_Station}' and ID_Measured_Unit = ${ID_Measured_Unit})
                update MQTT_Message_Unit
                set ${messageStr} ${queueStr}
                where ID_Station = '${ID_Station}' and ID_Measured_Unit = ${ID_Measured_Unit}
            else
                INSERT INTO MQTT_Message_Unit(ID_Station, ID_Measured_Unit, Message, Queue_Number) VALUES ('${ID_Station}', ${ID_Measured_Unit}, '${Message}', ${Queue_Number}); 
                select ID_Station, MQTT_Message_Unit.ID_Measured_Unit, Message, Title, Unit, Queue_Number from MQTT_Message_Unit inner join Measured_Unit on MQTT_Message_Unit.ID_Measured_Unit = Measured_Unit.ID_Measured_Unit where ID_Station = '${ID_Station}' and MQTT_Message_Unit.ID_Measured_Unit = '${ID_Measured_Unit}';`,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
          res.status(500).send('Server error')
        } else {
          res.json(all[0])
        }
      }
    )
    request.on('row', (columns) => {
      var row = {}
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value
      })
      all.push(row)
    })
    connection.execSql(request)
  })
})

router.post('/deleteMessageUnit', auth, async (req, res) => {
  const { ID_Station, ID_Measured_Unit } = req.body
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    request = new Request(
      `delete from MQTT_Message_Unit where ID_Station = '${ID_Station}' and ID_Measured_Unit = ${ID_Measured_Unit}; `,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
          res.status(500).send('Server error')
        } else {
          res.json({
            ID_Station: ID_Station,
            ID_Measured_Unit: ID_Measured_Unit,
          })
        }
      }
    )
    connection.execSql(request)
  })
})

// router.get('/updateStationData', auth, async (req, res) => {
//   let { stationId, ID_SaveEcoBot } = req.query
//   let stationNumberId = ID_SaveEcoBot.split('_')[1]

//   let saveEcoBotMeasurmentUnitId = {
//     temperature: 6,
//     humidity: 1,
//     pressure_pa: 5,
//     pm1: 10,
//     pm25: 3,
//     pm10: 2,
//     no2_ug: 11,
//     so2_ug: 13,
//     co_mg: 12,
//     gamma: 14,
//     no2_ppb: 16,
//     so2_ppb: 15,
//     co_ppm: 7,
//   }

//   // async function writeOneMeasurment(ID_Station, value, ID_Unit) {}

//   requestToAPI(
//     `https://www.saveecobot.com/api/v1/sensor-archives/${stationNumberId}`,
//     {
//       headers: {
//         apikey: API_KEY,
//       },
//     },
//     (error, response, body) => {
//       let data = body.split('\n')
//       data = data.map((d) => d.split(','))
//       data.splice(0, 1)

//       console.log(data)

//       var connection = new Connection(config.ecoSensors)
//       connection.connect()
//       connection.on('connect', function (err) {
//         data.forEach(async (d, index) => {
//           // console.log('start')

//           let request = new Request(
//             `insert into Measurment(Value, ID_Station, ID_Measured_Unit) values( ${
//               d[2]
//             }, '${stationId}', ${saveEcoBotMeasurmentUnitId[d[1]]})`,
//             function (err, rowCount, rows) {
//               if (err) {
//                 console.log(err)
//               } else {
//                 console.log(rowCount, rows)
//                 console.log(123, 213)
//               }

//               if (index === data.length - 1) {
//                 connection.close()
//               }
//             }
//           )

//           await connection.execSql(request)

//           // writeMeasurments(d[2], stationId, saveEcoBotMeasurmentUnitId[d[1]])
//         })
//       })
//     }
//   )
// })

router.get('/getMessageUnitList', auth, async (req, res) => {
  var url = req.query
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    var all = []
    request = new Request(
      `select ID_Station, MQTT_Message_Unit.ID_Measured_Unit, Message, Title, Unit, Queue_Number from MQTT_Message_Unit inner join Measured_Unit on MQTT_Message_Unit.ID_Measured_Unit = Measured_Unit.ID_Measured_Unit where ID_Station = '${url.ID_Station}' order by Queue_Number;`,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
          res.status(500).send('Server error')
        } else {
          res.json(all)
        }
      }
    )
    request.on('row', (columns) => {
      var row = {}
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value
      })
      all.push(row)
    })
    connection.execSql(request)
  })
})

router.get('/unitsAll', auth, async (req, res) => {
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    var all = []
    request = new Request(`select * from Measured_Unit`, function (
      err,
      rowCount,
      rows
    ) {
      connection.close()
      if (err) {
        console.log(err)
        res.status(500).send('Server error')
      } else {
        res.json(all)
      }
    })
    request.on('row', (columns) => {
      var row = {}
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value
      })
      all.push(row)
    })
    connection.execSql(request)
  })
})

router.post('/status', auth, async (req, res) => {
  const { id, status } = req.body
  var result = {}
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    request = new Request(
      `update Station set Status = '${status}' where ID_Station = ${id}`,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
          res.status(500).send('Server error')
        } else {
          res.json({
            id: id,
            status: status,
          })
        }
      }
    )
    connection.execSql(request)
  })
})

router.get('/getMqttStationList', auth, async (req, res) => {
  var url = req.query
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    var all = []
    request = new Request(
      `select * from Station where ID_Server = 1;`,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
          res.status(500).send('Server error')
        } else {
          res.json(all)
        }
      }
    )
    request.on('row', (columns) => {
      var row = {}
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value
      })
      all.push(row)
    })
    connection.execSql(request)
  })
})

// @route    GET api/station/system
// @desc     Get station list on system by url params
// @access   Public
router.get('/system/', auth, async (req, res) => {
  var url = req.query
  var connection = new Connection(config.user(req.user))
  connection.connect()
  connection.on('connect', function (err) {
    var all = []
    let requestStr = 'select * from Station_Coordinates'
    let orderStr = ''

    if (url.searchString) {
      requestStr = `select *
            from Station_Coordinates
            where CHARINDEX('${url.searchString}', CONCAT(ID_Station, Name)) != 0`
    }

    if (url.order == 'idUp') {
      orderStr = ' order by ID_Station'
    } else if (url.order == 'idDown') {
      orderStr = ' order by ID_Station DESC'
    }

    request = new Request(requestStr + orderStr, function (
      err,
      rowCount,
      rows
    ) {
      connection.close()
      if (err) {
        console.log(err)
        res.status(500).send('Server error')
      } else {
        res.json(all)
      }
    })
    request.on('row', (columns) => {
      var row = {}
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value
      })
      all.push(row)
    })
    connection.execSql(request)
  })
})

// @route    GET station/ecoBot
// @desc     Get station list on ecoBot by url params
// @access   Public
router.get('/ecoBot/', auth, async (req, res) => {
  var url = req.query
  var stationsInfo = []
  requestToAPI(
    'https://api.saveecobot.com/output.json',
    { json: true },
    function (error, response, body) {
      body.forEach((station) => {
        var searchIn = station.id + station.stationName
        var searchFor = ''
        var searchCity = ''
        if (url.searchString != undefined) searchFor = url.searchString
        if (url.city != undefined) searchCity = url.city
        if (searchCity == 'All') searchCity = ''
        if (
          searchIn.includes(searchFor) &&
          station.cityName.includes(searchCity)
        ) {
          var newStation = {
            ID_SaveEcoBot: station.id,
            Сity: station.cityName,
            Name: station.stationName,
            Longitude: station.longitude,
            Latitude: station.latitude,
          }
          stationsInfo.push(newStation)
        }
      })
      res.json(stationsInfo)
    }
  )
})

// @route    station/cityListEcoBot
// @desc     Get city list on ecoBot by url params
// @access   Public
router.get('/cityListEcoBot/', auth, async (req, res) => {
  var url = req.query
  var cityList = []
  requestToAPI(
    'https://api.saveecobot.com/output.json',
    { json: true },
    function (error, response, body) {
      body.forEach((station) => {
        if (!cityList.includes(station.cityName)) {
          cityList.push(station.cityName)
        }
      })
      res.json(cityList)
    }
  )
})

// @route    POST station/units
// @desc     Get unit list for station by station id
// @access   Public
router.post('/units/', auth, async (req, res) => {
  const { ID_Station } = req.body
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    var all = []
    request = new Request(
      `select Title
        from Measurment inner join Measured_Unit
        ON Measurment.ID_Measured_Unit = Measured_Unit.ID_Measured_Unit
        where ID_Station = '${ID_Station}' AND Time > DATEADD(day, -2, GETDATE())
        group by Title;`,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
          res.status(500).send('Server error')
        } else {
          res.json(all)
        }
      }
    )
    request.on('row', (columns) => {
      columns.forEach((column) => {
        all.push(column.value)
      })
    })
    connection.execSql(request)
  })
})

// @route    POST station/delete
// @desc     Delete station by station id
// @access   Public
router.post('/delete/', auth, async (req, res) => {
  const { ID_Station } = req.body
  var connection = new Connection(config.ecoSensors)
  connection.connect()
  connection.on('connect', function (err) {
    request = new Request(
      `Delete from Station where ID_Station='${ID_Station}'`,
      function (err, rowCount, rows) {
        connection.close()
        if (err) {
          console.log(err)
          res.status(500).send('Server error')
        } else {
          res.json({
            ID_Station: ID_Station,
            message: 'Station deleted',
          })
        }
      }
    )
    connection.execSql(request)
  })
})

module.exports = router

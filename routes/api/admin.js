const express = require('express');
const router = express.Router();
const config = require('../../config/db');
const { Connection, Request } = require("tedious");
const auth = require('../../middleware/auth');

router.post('/addUser', auth, async (req, res) => {
    const {login, password} = req.body;
    var result = {};
    var connection = new Connection(config.master);
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(`CREATE LOGIN ${login} WITH PASSWORD = '${password}'; `, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                //console.log(err.message);
                if (err.message.includes("already exists")) {
                    res.json({
                        message: "login already exists"
                    })
                } else {
                    res.json({
                        message: "password error"
                    })
                }
            } else {
                createUserForLogin(login);
                res.json({
                    login: login,
                    password: password
                });
            }
        })
    connection.execSql(request);
    })
})

async function createUserForLogin (login) {
    var ecoConnection = new Connection(config.ecoSensors);
    ecoConnection.connect();
    ecoConnection.on('connect', function(err) {
        request = new Request(`CREATE USER ${login}
                                FOR LOGIN ${login}
                                WITH DEFAULT_SCHEMA = dbo; 
                                ALTER ROLE db_datareader ADD MEMBER ${login};`, function(err, rowCount, rows) {
            ecoConnection.close();
            if (err) {
            console.log(err);
            }
        })
        ecoConnection.execSql(request);
    });
}

/*var userConfig = {
    authentication: {
        options: {
          userName: "testUser5", // update me
          password: "adddaaaSS22" // update me
        },
        type: "default"
      },
      server: "ecosensors.database.windows.net", // update me
      options: {
        database: "EcoSensorsAzure", //update me
        encrypt: true,
        packetSize: 32768,
        trustServerCertificate: true
      }
}

router.post('/test', async (req, res) => {
    var connection = new Connection(userConfig);
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request("select * from Station", function(err, rowCount, rows) {
            connection.close();
            if (err) {
                res.status(500).send('Server error');
            } else {
                res.json(all);
            }
        });
        request.on("row", columns => {
            var row = {};
            columns.forEach(column => {
              row[column.metadata.colName] = column.value;
            });
            all.push(row);
          });
        connection.execSql(request);
    })
})*/


router.post('/setWorkingStatus', auth, async (req, res) => {
    const {status} = req.body;
    var connection = new Connection(config.ecoSensors);
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(`UPDATE System_Configuration
        SET Working_Status = ${status}
        WHERE Configuration_ID = 1;`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                console.log(err);
                res.status(500).send('Server error');
            } else {
                res.json({
                    status: status
                });
            }
        })
    connection.execSql(request);
    })
})

router.get('/config', auth, async (req, res) => {
    var connection = new Connection(config.ecoSensors);
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request("select * from System_Configuration;", function(err, rowCount, rows) {
            connection.close();
            if (err) {
                res.status(500).send('Server error');
            } else {
                res.json(all[0]);
            }
        });
        request.on("row", columns => {
            var row = {};
            columns.forEach(column => {
              row[column.metadata.colName] = column.value;
            });
            all.push(row);
          });
        connection.execSql(request);
    })
})


module.exports = router;
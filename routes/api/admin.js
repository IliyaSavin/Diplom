const express = require('express');
const router = express.Router();
const config = require('../../config/db');
const { Connection, Request } = require("tedious");
const auth = require('../../middleware/auth');
const xl = require('excel4node');

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
                        message: "Login already exists"
                    })
                } else {
                    res.json({
                        message: "Password error"
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


router.get('/activityLog/', auth, async (req, res) => {
    var url = req.query;
    var connection = new Connection(config.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        let requestStr = `SELECT event_time, sys.fn_get_audit_file.action_id, name, succeeded, server_principal_name, statement, additional_information, client_ip, duration_milliseconds FROM sys.fn_get_audit_file
                            (
                            'https://ecoaudit.blob.core.windows.net/sqldbauditlogs/ecosensors/EcoSensorsAzure/SqlDbAuditing_Audit_NoRetention/2021-04-12/15_11_13_772_0.xel', default, default
                            ) inner join sys.dm_audit_actions ON sys.fn_get_audit_file.action_id = sys.dm_audit_actions.action_id`;
        let orderStr = "";
        let userStr = "";
        let errorStr = "";

        if (url.user) {
            userStr = ` WHERE server_principal_name='${url.user}'`;
        }

        if (url.onlyErrors) {
            if (userStr == "") {
                errorStr = "  WHERE succeeded=0";
            } else {
                errorStr = " and succeeded=0";
            }
        }

        let whereStr = userStr + errorStr;
        if (url.dateFrom) {
            if (whereStr == "") {
                whereStr = ` WHERE event_time >= '${url.dateFrom}'`;
            } else {
                whereStr += ` and event_time >= '${url.dateFrom}'`;
            }
        }

        if (url.dateTo) {
            if (whereStr == "") {
                whereStr = ` WHERE event_time < '${url.dateTo}'`;
            } else {
                whereStr += ` and event_time < '${url.dateTo}'`;
            }
        }

        if (url.order == "Up") {
            orderStr = " ORDER BY event_time";
        } else if (url.order == "Down") {
            orderStr = " ORDER BY event_time DESC";
        }

        request = new Request(requestStr + whereStr + orderStr, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                console.log(err);
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
});


module.exports = router;
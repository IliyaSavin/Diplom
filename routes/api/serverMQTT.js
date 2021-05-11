const express = require('express');
const router = express.Router();
const config = require('../../config/db');
const { Connection, Request } = require("tedious");
const auth = require('../../middleware/auth');

router.post('/status', auth, async (req, res) => {
    const {id, status} = req.body;
    var result = {};
    var connection = new Connection(config.ecoSensors);
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(`update MQTT_Server set Status = '${status}' where ID_Server = ${id}`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                console.log(err);
                res.status(500).send('Server error');
            } else {
                res.json({
                    "id": id,
                    "status": status
                });
            }
        });
        connection.execSql(request);
    });
})

router.get('/messages/', auth, async (req, res) => {
    var url = req.query;
    var connection = new Connection(config.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        let requestStr = "select * from Server_Message order by Message_Date";

        if (url.searchString) {
            requestStr = `select * from Server_Message where Topic like '%${url.searchString}%' order by Message_Date`;
        }

        request = new Request(requestStr, function(err, rowCount, rows) {
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
              row[column.metadata.colName] = column.value.toString().trim();
            });
            all.push(row);
          });
        connection.execSql(request);
    })
});

router.get('/', auth, async (req, res) => {
    var connection = new Connection(config.ecoSensors);
    connection.connect();
    connection.on('connect', function(err) {
        var row = {};
        request = new Request("select * from MQTT_Server where ID_Server = 1", function(err, rowCount, rows) {
            connection.close();
            if (err) {
                res.status(500).send('Server error');
            } else {
                res.json(row);
            }
        });
        request.on("row", columns => {
            columns.forEach(column => {
              row[column.metadata.colName] = column.value;
            });
            //all.push(row);
          });
        connection.execSql(request);
    })
})

module.exports = router;
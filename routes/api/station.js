const express = require('express');
const router = express.Router();
const config = require('../../config/db');
const { Connection, Request } = require("tedious");

router.post('/status', async (req, res) => {
    const {id, status} = req.body;
    var result = {};
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(`update Station set Status = '${status}' where ID_Station = ${id}`, function(err, rowCount, rows) {
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



router.get('/', async (req, res) => {
    var connection = new Connection(config);
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
})

module.exports = router;
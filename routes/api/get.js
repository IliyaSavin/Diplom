const express = require('express');
const router = express.Router();
const config = require('../../config/db');
const { Connection, Request } = require("tedious");


router.get('/seasons', async (req, res) => {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request("select id_времени_года, Название from Время_года", function(err, rowCount, rows) {
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

router.get('/measuredValue', async (req, res) => {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request("select id_измеряемой_величины, Название, Единица_измерения, Обозначение from Измеряемая_величина", function(err, rowCount, rows) {
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

router.get('/terrain', async (req, res) => {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request("select id_местности, Тип_местности from Местность", function(err, rowCount, rows) {
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

router.get('/sensors', async (req, res) => {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request("select id_датчика, Модель from Датчик", function(err, rowCount, rows) {
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
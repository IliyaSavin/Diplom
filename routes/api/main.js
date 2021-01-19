const express = require('express');
const router = express.Router();
const config = require('../../config/db');
const { Connection, Request } = require("tedious");

router.get('/sensors', async (req, res) => {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request("select id_датчика, Модель, Производитель, Точность, Интервал, Название as Параметр, Единица_измерения, Обозначение from Датчик"
        + " JOIN Измеряемая_величина ON Датчик.id_измеряемой_величины = Измеряемая_величина.id_измеряемой_величины;", function(err, rowCount, rows) {
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

router.get('/optimal', async (req, res) => {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request("select Измеряемая_величина.Название as Параметр, Единица_измерения, Обозначение, Время_года.Название as Время_года, id_местности, Нижняя_граница, Верхняя_граница"
        + " from Оптимальные_значения"
        + " JOIN Измеряемая_величина ON Оптимальные_значения.id_измеряемой_величины = Измеряемая_величина.id_измеряемой_величины"
        + " JOIN Время_года ON Оптимальные_значения.id_времени_года = Время_года.id_времени_года", function(err, rowCount, rows) {
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
        request = new Request("select Местность.id_местности, Тип_местности, Площадь, Широта, Долгота"
        + " from Местность"
        + " JOIN Координаты ON Координаты.id_местности = Местность.id_местности", function(err, rowCount, rows) {
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

router.get('/measurments', async (req, res) => {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request("select * from Замер_данных_датчика", function(err, rowCount, rows) {
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
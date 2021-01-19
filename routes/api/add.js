const express = require('express');
const router = express.Router();
const config = require('../../config/db');
const { Connection, Request, TYPES } = require("tedious");


// @route    POST api/sensor
// @desc     Add new sensor
// @access   Public
router.post('/sensor', async (req, res) => {

    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        const {id_value, model, manufacturer, precision, interval} = req.body;
        var result = {};
        request = new Request(`insert into Датчик output INSERTED.id_датчика values( ${id_value}, '${model}', '${manufacturer}', ${precision} , '${interval}')`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                res.status(500).send('Server error');
            } else {
                res.json(result);
            }
        });
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result[column.metadata.colName] = column.value;
              }  
            });  
        });   
        connection.execSql(request);
    })
})

// @route    POST api/optimal
// @desc     Add new optimal value
// @access   Public
router.post('/optimal', async (req, res) => {
    const {id_value, id_season, id_terrain, bottom, top} = req.body;
    var result = {};
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(`insert into Оптимальные_значения output 
        INSERTED.id_измеряемой_величины, 
        INSERTED.id_времени_года, 
        INSERTED.id_местности 
         values(${id_season}, ${id_terrain}, ${id_value}, ${bottom} , ${top})`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                res.status(500).send('Server error');
            } else {
                res.json(result);
            }
        });
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result[column.metadata.colName] = column.value;
              }  
            });  
        });   
        connection.execSql(request);
    })
})

router.post('/checkOptimal', async (req, res) => {
    const {id_value, id_season, id_terrain} = req.body;
    var connection = new Connection(config);
    var isCreated = false;
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(`select id_времени_года 
        from Оптимальные_значения 
        where id_времени_года = ${id_season} and id_местности = ${id_terrain} and id_измеряемой_величины = ${id_value}`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                res.status(500).send('Server error');
            } else {
                res.json({
                    isCreated: isCreated
                })
            }
            });
        request.on('row', function(columns) {  
            if (columns[0].value != null) {
                isCreated = true;
            }
        });
        connection.execSql(request);
    });
})

function checkOptimalValue(data, result) {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(`select id_времени_года 
        from Оптимальные_значения 
        where id_времени_года = ${data.id_season} and id_местности = ${data.id_terrain} and id_измеряемой_величины = ${data.id_value}`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
            }
            });
        request.on('row', function(columns) {  
            if (columns[0].value != null) {
                result.isCreated = true;
            }
        });
        connection.execSql(request);
    });
}

// @route    POST api/terrain
// @desc     Add new terrain
// @access   Public
router.post('/terrain', async (req, res) => {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        const {terrain_type, area, latitude, longitude} = req.body;
        var result = {};
        var id_terrain = null;
        
        request = new Request(`insert into Местность output INSERTED.id_местности values( '${terrain_type}', ${area})`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                res.status(500).send('Server error');
            } else {
                createCoordinates(id_terrain, latitude, longitude);
                res.json(result);
            }
        });
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result[column.metadata.colName] = column.value;
                id_terrain = column.value;
              }
            });  
        });
        connection.execSql(request);
    })
})

function createCoordinates(id_terrain, latitude, longitude) {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(`insert into Координаты values( ${id_terrain}, ${latitude}, ${longitude})`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
            }
            });
        connection.execSql(request);
    });
}

// @route    POST api/season
// @desc     Add new season
// @access   Public
router.post('/season', async (req, res) => {

    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        const {season} = req.body;
        var result = {};
        request = new Request(`insert into Время_года output INSERTED.id_времени_года values('${season}')`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                res.status(500).send('Server error');
            } else {
                res.json(result);
            }
        });
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result[column.metadata.colName] = column.value;
              }  
            });  
        });   
        connection.execSql(request);
    })
})

// @route    POST api/measurment
// @desc     Add new measurment
// @access   Public
router.post('/measurment', async (req, res) => {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        const {id_sensor, id_terrain, value, time} = req.body;
        var result = {};
        request = new Request(`insert into Замер_данных_датчика output INSERTED.id_замера_данных values(${id_sensor}, ${id_terrain}, ${value}, '${time}')`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                res.status(500).send('Server error');
            } else {
                res.json(result);
            }
        });
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result[column.metadata.colName] = column.value;
              }
            });  
        });   
        connection.execSql(request);
    })
})

// @route    POST api/measuredValue
// @desc     Add new measured value
// @access   Public
router.post('/measuredValue', async (req, res) => {
    var connection = new Connection(config);
    connection.connect();
    connection.on('connect', function(err) {
        const {title, unit, label} = req.body;
        var result = {};
        request = new Request(`insert into Измеряемая_величина output INSERTED.id_измеряемой_величины values('${title}', '${unit}', '${label}')`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                res.status(500).send('Server error');
            } else {
                res.json(result);
            }
        });
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result[column.metadata.colName] = column.value;
              }
            });  
        });   
        connection.execSql(request);
    })
})



module.exports = router;
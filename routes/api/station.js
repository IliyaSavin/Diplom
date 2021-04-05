const express = require('express');
const router = express.Router();
const config = require('../../config/db');
const { Connection, Request } = require("tedious");
const requestToAPI = require('request');
const auth = require('../../middleware/auth');

router.post('/addStationEcoBot', auth, async (req, res) => {
    const {id_SaveEcoBot} = req.body;

    requestToAPI('https://api.saveecobot.com/output.json', { json: true }, function (error, response, body) {

        body.forEach(station => {
            if (station.id == id_SaveEcoBot) {
                var connection = new Connection(config.ecoSensors);
                connection.connect();
                connection.on('connect', function(err) {
                    request = new Request(`IF NOT EXISTS (SELECT * FROM Station WHERE ID_SaveEcoBot = '${station.id}') 
                                            BEGIN
                                            EXEC Add_Station @city = '${station.cityName}',
                                                    @name = '${station.stationName}',
                                                    @id_SaveEcoBot = '${station.id}',
                                                    @longitude = ${station.longitude},
                                                    @latitude = ${station.latitude}
                                            END`, function(err, rowCount, rows) {
                        connection.close();
                        if (err) {
                            console.log(err);
                            res.status(500).send('Server error');
                        } else {
                            res.json({ msg: 'Station added'});
                        }
                    })
                connection.execSql(request);
                })
            }
        });
    })
})

router.post('/addStation', auth, async (req, res) => {
    const {city, name, id_SaveEcoBot, id_server, longitude, latitude} = req.body;
    var result = {};
    var typeStr = "";
    if (id_SaveEcoBot) {
        typeStr = `@id_SaveEcoBot = '${id_SaveEcoBot}'`;
    } else if (id_server) {
        typeStr = `@id_server = '${id_server}'`;
    }
    var connection = new Connection(config.ecoSensors);
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(`EXEC Add_Station @city = '${city}',
                                @name = '${name}',
                                ${typeStr},
                                @longitude = ${longitude},
                                @latitude = ${latitude} `, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                console.log(err);
                res.status(500).send('Server error');
            } else {
                res.json({ msg: 'Station added'});
            }
        })
    connection.execSql(request);
    })
})


router.post('/status', auth, async (req, res) => {
    const {id, status} = req.body;
    var result = {};
    var connection = new Connection(config.ecoSensors);
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


// @route    GET api/station/system
// @desc     Get station list on system by url params
// @access   Public
router.get('/system/', auth, async (req, res) => {
    var url = req.query;
    var connection = new Connection(config.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        let requestStr = "select * from Station_Coordinates";
        let orderStr = "";

        if (url.searchString) {
            requestStr = `select *
            from Station_Coordinates
            where CHARINDEX('${url.searchString}', CONCAT(ID_Station, Name)) != 0`;
        }

        if (url.order == "idUp") {
            orderStr = " order by ID_Station";
        } else if (url.order == "idDown") {
            orderStr = " order by ID_Station DESC";
        }

        request = new Request(requestStr + orderStr, function(err, rowCount, rows) {
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

// @route    GET api/station/ecoBot
// @desc     Get station list on ecoBot by url params
// @access   Public
router.get('/ecoBot/', auth, async (req, res) => {
    var url = req.query;
    var stationsInfo = [];
    requestToAPI('https://api.saveecobot.com/output.json', { json: true }, function (error, response, body) {
            body.forEach(station => {
            var searchIn = station.id + station.stationName;
            var searchFor = "";
            var searchCity = "";
            if (url.searchString != undefined) searchFor = url.searchString;
            if (url.city != undefined) searchCity = url.city;
            if (searchIn.includes(searchFor) && station.cityName.includes(searchCity)) {
                var newStation = {
                    ID_SaveEcoBot: station.id,
                    Сity: station.cityName,
                    Name: station.stationName,
                    Longitude: station.longitude,
                    Latitude: station.latitude
                }
                stationsInfo.push(newStation);
            }
        });
        res.json(stationsInfo);
    })

});

module.exports = router;
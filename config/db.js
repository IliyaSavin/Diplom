var config = {
    authentication: {
        options: {
          userName: "ecoAdmin", // update me
          password: "SensorsPassword12#" // update me
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
};

module.exports = config;
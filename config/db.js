var config = {
    ecoSensors: {
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
    },
    master: {
      authentication: {
        options: {
          userName: "ecoAdmin", // update me
          password: "SensorsPassword12#" // update me
        },
        type: "default"
      },
      server: "ecosensors.database.windows.net", // update me
      options: {
        database: "master", //update me
        encrypt: true,
        packetSize: 32768,
        trustServerCertificate: true
      }
    },
    user: function(user) {
      return {
        authentication: {
          options: {
            userName: user.login, // update me
            password: user.password // update me
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
    }
};

module.exports = config;
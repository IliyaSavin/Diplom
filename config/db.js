var config = {
    authentication: {
        options: {
          userName: "adminserv", // update me
          password: "123456789Qw" // update me
        },
        type: "default"
      },
      server: "nubipsserver.database.windows.net", // update me
      options: {
        database: "Practice", //update me
        encrypt: true,
        packetSize: 32768,
        trustServerCertificate: true
      }
};

module.exports = config;
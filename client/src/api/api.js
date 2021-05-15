import axios from 'axios';
import {loginUser} from '../redux/features/authSlice';

const instance = axios.create({
  baseURL: 'http://localhost:5000/',
  headers: {
    'Content-type': 'application/json',
  },
});

export const userAPI = {
  login: (login, password) =>
    instance
      .post('auth', {login: login, password: password})
      .then((response) => response.data),
  addUser: (login, password) =>
    instance
      .post(
        'admin/addUser',
        {login: login, password: password},
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
};

export const mqttAPI = {
  getMessages: (searchString = '') =>
    instance
      .get(`server/messages${searchString}`, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
  getServers: () =>
    instance
      .get(`server`, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
  setServerStatus: (id, status) =>
    instance
      .post(
        'server/status',
        {id, status},
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
  getMqttStationsList: () =>
    instance
      .get(`station/getMqttStationList`, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
  getMessageUnitList: (stationID) =>
    instance
      .get(`station/getMessageUnitList?ID_Station=${stationID}`, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
  deleteMessageUnit: (ID_Station, ID_Measured_Unit) =>
    instance
      .post(
        'station/deleteMessageUnit',
        {ID_Station, ID_Measured_Unit},
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
  getAllUnits: () =>
    instance
      .get(`station/unitsAll`, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
  addNewMessage: (ID_Station, ID_Measured_Unit, Message, Queue_Number) =>
    instance
      .post(
        'station/changeMessageUnit',
        {ID_Station, ID_Measured_Unit, Message, Queue_Number},
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
  addMqtt: (city, name, id_server, longitude, latitude) =>
    instance
      .post(
        'station/addStation',
        {city, name, id_server, longitude, latitude},
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
};

export const logsAPI = {
  getAllUsers: () =>
    instance
      .get('admin/users', {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),

  getAllLogs: (string) =>
    instance
      .get(`admin/activityLog${string}`, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
};

export const stationsAPI = {
  getAllStations: (string) =>
    instance
      .get(`station/system/${string}`, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
  getStationsUnit: (id) =>
    instance
      .post(
        'station/units',
        {ID_Station: id},
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),

  changeStatus: (id, status) =>
    instance
      .post(
        'station/status',
        {
          id: id,
          status: status,
        },
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
  deleteStation: (id) =>
    instance
      .post(
        'station/delete',
        {
          ID_Station: id,
        },
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
  getAdminConfig: () =>
    instance
      .get('admin/config', {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
  setGlobalStatus: (status) =>
    instance
      .post(
        'admin/setWorkingStatus',
        {
          status: status,
        },
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
  getAllStationsEcoBot: (string) =>
    instance
      .get(`station/ecoBot/${string}`, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
  getCityListEcoBot: () =>
    instance
      .get(`station/cityListEcoBot`, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
  addStation: (id) =>
    instance
      .post(
        `station/addStationEcoBot`,
        {
          id_SaveEcoBot: id,
        },
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
};

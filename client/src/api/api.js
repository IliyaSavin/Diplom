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

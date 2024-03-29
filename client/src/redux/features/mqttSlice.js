import { createSlice } from '@reduxjs/toolkit'
import { mqttAPI } from '../../api/api'

const initialState = {
  isLoading: false,
  pageFirstTable: 1,
  pageSecondTable: 1,
}

export const mqttSlice = createSlice({
  name: 'mqtt',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          ...action.payload,
        },
      }
    },
    setPageFirst: (state, action) => {
      return {
        ...state,
        pageFirstTable: action.payload,
      }
    },
    setPageSecond: (state, action) => {
      return {
        ...state,
        pageSecondTable: action.payload,
      }
    },
    setAllMessages: (state, action) => {
      return {
        ...state,
        messages: action.payload,
      }
    },
    setServers: (state, action) => {
      return {
        ...state,
        server: action.payload,
      }
    },
    updateStatusServer: (state, action) => {
      return {
        ...state,
        server: {
          ...state.server,
          Status: action.payload.status,
        },
      }
    },
    setMqttStations: (state, action) => {
      return {
        ...state,
        mqtt_stations: action.payload,
      }
    },
    updateMqttStations: (state, action) => {
      return {
        ...state,
        mqtt_stations: [...state.mqtt_stations, action.payload],
      }
    },
    setMessageUnitList: (state, action) => {
      return {
        ...state,
        message_unit_list: action.payload,
      }
    },
    deleteMessageUnits: (state, action) => {
      return {
        ...state,
        message_unit_list: [
          ...state.message_unit_list.filter(
            (m) => m.ID_Measured_Unit != action.payload.ID_Measured_Unit
          ),
        ],
      }
    },
    updateMessageUnit: (state, action) => {
      return {
        ...state,
        message_unit_list: [...state.message_unit_list, action.payload],
      }
    },
    setAllUnits: (state, action) => {
      return {
        ...state,
        all_units: action.payload,
      }
    },
  },
})

export const {
  setLoading,
  setPageFirst,
  setPageSecond,
  setAllMessages,
  setServers,
  updateStatusServer,
  setMqttStations,
  setMessageUnitList,
  deleteMessageUnits,
  setAllUnits,
  updateMessageUnit,
  updateMqttStations,
} = mqttSlice.actions

//@Thunks

export const getAllMessages =
  (searchString = '') =>
  async (dispatch) => {
    dispatch(setLoading({ monitoring: true }))
    let data = await mqttAPI.getMessages(searchString)
    dispatch(setAllMessages(data))
    dispatch(setLoading({ monitoring: undefined }))
  }

export const getServers = () => async (dispatch) => {
  dispatch(setLoading({ server: true }))
  let data = await mqttAPI.getServers()
  dispatch(setServers(data))
  dispatch(setLoading({ server: undefined }))
}

export const setServerStatus = (id, status) => async (dispatch) => {
  dispatch(setLoading({ server: true }))
  let data = await mqttAPI.setServerStatus(id, status)
  dispatch(updateStatusServer(data))
  dispatch(setLoading({ server: undefined }))
}

export const getMqttList = () => async (dispatch) => {
  dispatch(setLoading({ units: true }))
  let data = await mqttAPI.getMqttStationsList()
  dispatch(setMqttStations(data))
  dispatch(setLoading({ units: undefined }))
}

export const getMessageUnitList = (stationID) => async (dispatch) => {
  dispatch(setLoading({ units: true }))
  let data = await mqttAPI.getMessageUnitList(stationID)
  dispatch(setMessageUnitList(data))
  dispatch(setLoading({ units: undefined }))
}

export const deleteMessageUnit =
  (ID_Station, ID_Measured_Unit) => async (dispatch) => {
    dispatch(setLoading({ units: true }))
    let data = await mqttAPI.deleteMessageUnit(ID_Station, ID_Measured_Unit)
    dispatch(deleteMessageUnits(data))
    dispatch(setLoading({ units: undefined }))
  }
export const getAllUnits = () => async (dispatch) => {
  dispatch(setLoading({ unitsList: true }))
  let data = await mqttAPI.getAllUnits()
  dispatch(setAllUnits(data))
  dispatch(setLoading({ unitsList: undefined }))
}

export const addMessage =
  (ID_Station, ID_Measured_Unit, Message, Queue_Number) => async (dispatch) => {
    dispatch(setLoading({ units: true }))
    let data = await mqttAPI.addNewMessage(
      ID_Station,
      ID_Measured_Unit,
      Message,
      Queue_Number
    )
    dispatch(updateMessageUnit(data))
    dispatch(setLoading({ units: undefined }))
  }

export const addMqtt =
  (city, name, id_server, longitude, latitude) => async (dispatch) => {
    dispatch(setLoading({ units: true }))
    let data = await mqttAPI.addMqtt(city, name, id_server, longitude, latitude)
    dispatch(updateMqttStations(data))
    dispatch(setLoading({ units: undefined }))
  }
// @SELECTORS

export const selectIsLoading = (state) => state.mqtt.isLoading
export const selectPageFirst = (state) => state.mqtt.pageFirstTable
export const selectPageSecond = (state) => state.mqtt.pageSecondTable
export const selectAllMessages = (state) => state.mqtt.messages
export const selectServer = (state) => state.mqtt.server
export const selectMqttStations = (state) => state.mqtt.mqtt_stations
export const selectMessageUnitList = (state) => state.mqtt.message_unit_list
export const selectAllUnitsList = (state) => state.mqtt.all_units

export default mqttSlice.reducer

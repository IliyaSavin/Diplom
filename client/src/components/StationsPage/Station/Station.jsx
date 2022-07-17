import React from 'react'
import L from 'leaflet'
import './Station.sass'
import { Modal } from 'antd'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Pin from 'leaflet/dist/images/marker-icon-2x.png'
import Shadow from 'leaflet/dist/images/marker-shadow.png'
import SaveEcoBot from '../../../img/SaveEcoBot.png'
import OwnImg from '../../../img/own.png'
import { useDispatch } from 'react-redux'
import {
  changeStatusStation,
  deleteStation,
} from '../../../redux/features/stationsSlice'
import StationBadge from './StationBadge'
import { addStation } from '../../../redux/features/addStationSlice'

function Station({ station, addPage }) {
  const dot = [station.Latitude, station.Longitude]

  const dispatch = useDispatch()

  const Icon = L.icon({
    iconUrl: Pin,
    shadowUrl: Shadow,
    iconSize: [38, 55], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 54], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -50], // point from which the popup should open relative to the iconAnchor
  })

  const changeStatus = () => {
    const status = station.Status === 'enabled' ? 'disabled' : 'enabled'
    dispatch(changeStatusStation(station.ID_Station, status))
  }

  function warning() {
    Modal.warning({
      style: { top: '300px' },
      title: 'Do you want to delete this station?',
      content:
        'When it will be deleted, all data collected by this station will be removed',
      centered: false,
      onOk() {
        dispatch(deleteStation(station.ID_Station))
      },
      closable: true,
    })
  }

  function info() {
    Modal.info({
      style: { top: '300px' },
      title: 'This station will be added to your station list',
      onOk() {
        dispatch(addStation(station.ID_SaveEcoBot))
      },
      centered: false,
      closable: true,
    })
  }

  const { Name, ID_SaveEcoBot, Status, Сity } = station

  return (
    <div className='col-12 station'>
      <div className='card'>
        <div className='row'>
          <div className='col-md-4 col-12'>
            <MapContainer
              className='w-100'
              center={dot}
              zoom={10}
              scrollWheelZoom
              style={{ height: 200 }}
            >
              <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
              <Marker position={dot} icon={Icon}>
                <Popup>{station.Name}</Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className='col-8 card-body position-relative'>
            <div className='row'>
              <div className='col-12 position-relative'>
                <p className='station-name ms-2'>{Name}</p>
                {addPage && <p className='ms-2'>City: {Сity}</p>}
                {!addPage && (
                  <>
                    <div
                      className={`station-status d-none d-md-block ${
                        Status === 'enabled' ? 'active-station' : 'disabled'
                      }`}
                    >
                      {Status === 'enabled' ? 'Recording' : 'Disabled'}
                    </div>
                    <div
                      className={`station-status d-md-none hide ${
                        Status === 'enabled' ? 'active-station' : 'disabled'
                      }`}
                    ></div>
                  </>
                )}
              </div>
              <div className='col-12 station-badges'>
                {station.units?.map((unit) => (
                  <StationBadge title={unit} />
                ))}
              </div>
              <div className='col-12 logo-wrapper'>
                <a
                  href={ID_SaveEcoBot ? 'https://www.saveecobot.com/' : '/'}
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    src={ID_SaveEcoBot ? SaveEcoBot : OwnImg}
                    className='station-logo'
                    alt=''
                  />
                </a>
              </div>
              <div
                className='row station-buttons'
                style={{ width: 'fit-content' }}
              >
                {!addPage ? (
                  <>
                    <button
                      className='btn btn-primary me-2'
                      style={{ width: 'fit-content' }}
                      onClick={changeStatus}
                    >
                      {Status === 'enabled' ? 'Turn off' : 'Enable'}
                    </button>
                    <button
                      className='btn btn-danger'
                      style={{ width: 'fit-content' }}
                      onClick={warning}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button className='btn btn-success' onClick={info}>
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Station

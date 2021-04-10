import React, {useState} from 'react';
import L from 'leaflet';

import s from './Station.module.sass';
import {Modal, Button} from 'antd';

import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {Link} from 'react-router-dom';

import 'leaflet/dist/leaflet.css';
import Pin from 'leaflet/dist/images/marker-icon-2x.png';
import Shadow from 'leaflet/dist/images/marker-shadow.png';
import SaveEcoBot from '../../../img/SaveEcoBot.png';
import OwnImg from '../../../img/own.png';
import {useDispatch} from 'react-redux';
import {
  changeStatusStation,
  deleteStation,
} from '../../../redux/features/stationsSlice';

function Station({station, sortValue}) {
  const dot = [station.Latitude, station.Longitude];
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();

  const Icon = L.icon({
    iconUrl: Pin,
    shadowUrl: Shadow,

    iconSize: [38, 55], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 54], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -50], // point from which the popup should open relative to the iconAnchor
  });

  const style =
    station.Status === 'enabled'
      ? {
          backgroundColor: 'rgb(125, 238, 20)',
        }
      : {};

  const changeStatus = (e) => {
    const status = station.Status === 'enabled' ? 'disabled' : 'enabled';
    dispatch(changeStatusStation(station.ID_Station, status));
    console.log('change');
  };

  const onDelete = () => {
    setIsModalVisible(true);
  };

  function warning() {
    Modal.warning({
      title: 'Do you really want to delete this station?',
      content:
        'When deleted, all data collected by this station will be deleted',
      centered: true,
      onOk() {
        dispatch(deleteStation(station.ID_Station));
      },
      closable: true,
    });
  }

  return (
    <div className={s.station}>
      <div className={s.stationMap}>
        <MapContainer
          center={dot}
          zoom={10}
          scrollWheelZoom={false}
          style={{maxWidth: 300, width: '100%', height: 200}}
        >
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <Marker position={dot} icon={Icon}>
            <Popup>{station.Name}</Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className={s.stationInfo}>
        <div className={s.stationInfoTop}>
          <div className={s.stationInfoId}>
            ID Station: {station.ID_Station}
          </div>
          <div className={s.stationInfoName}>{station.Name}</div>
          <div className={s.stationInfoStatus} style={style}></div>
        </div>
        <div className={s.stationInfoBottom}>
          <div className={s.stationInfoSave}>
            <img
              src={station.ID_SaveEcoBot ? SaveEcoBot : OwnImg}
              className={s.stationInfoLogo}
            />
          </div>
          <div className={s.stationInfoValues}>{station?.units?.join(',')}</div>
          <div className={s.stationInfoView}>
            <Button type='primary' onClick={changeStatus}>
              Change Status
            </Button>
            <Button type='primary' danger on onClick={warning}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Station;

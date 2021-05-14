import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {setCurrentPageIndex} from '../../redux/features/stationsSlice';
import Formm from './Form/Form';
import s from './MqttStation.module.sass';
import TableMonitoring from './TableMonitoring/TableMonitoring';

function MqttStation() {
  const dispatch = useDispatch();

  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    dispatch(setCurrentPageIndex(['3.1']));
  }, []);

  return (
    <div className={s.mqttStation}>
      <div className={s.top_content}>
        <div className={s.mqtt_wrapper}>
          <Formm />
        </div>
        <div className={s.table_wrapper}>
          <TableMonitoring searchString={searchString} />
        </div>
      </div>
      <div className={s.bottom_content}></div>
    </div>
  );
}

export default MqttStation;

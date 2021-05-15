import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentPageIndex} from '../../redux/features/stationsSlice';
import Formm from './Form/Form';
import s from './MqttStation.module.sass';
import TableMonitoring from './TableMonitoring/TableMonitoring';

import {Input, Switch, Select} from 'antd';
import {
  getAllMessages,
  getMqttList,
  getServers,
  selectIsLoading,
  selectMqttStations,
  selectServer,
  setServerStatus,
} from '../../redux/features/mqttSlice';
import TableMonitoringUnit from './TableMonitoringUnit/TableMonitoringUnit';
import Loader from '../Loader/Loader';
import FormAdd from './FormAdd/FormAdd';
const {Search} = Input;
const {Option} = Select;

function MqttStation() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const server = useSelector(selectServer);
  const mqtt_stations = useSelector(selectMqttStations);

  const [selected_mqtt, setSelected_Mqtt] = useState(undefined);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    dispatch(setCurrentPageIndex(['3.1']));
    dispatch(getServers());
    dispatch(getMqttList());
  }, []);

  useEffect(() => {
    if (mqtt_stations) setSelected_Mqtt(mqtt_stations[0].ID_Station);
  }, [mqtt_stations]);

  const onChangeSwitch = (checked) => {
    console.log(checked);
    let status = checked ? 'enabled' : 'disabled';
    dispatch(setServerStatus(server.ID_Server, status));
  };

  console.log(selected_mqtt, 'mqqqqqtttt');

  return (
    <div className={s.mqttStation}>
      <div className={s.top_content}>
        <div className={s.mqtt_wrapper}>
          <Formm />
        </div>
        <div className={s.table_wrapper}>
          {!isLoading?.monitoring && (
            <div className={s.table_header}>
              <div>
                <Search
                  placeholder='Action ID or Statement'
                  value={searchString}
                  enterButton
                  onChange={(e) => setSearchString(e.currentTarget.value)}
                  onSearch={() =>
                    dispatch(getAllMessages(`?searchString=${searchString}`))
                  }
                />
              </div>
              <div>
                Message collecting
                <Switch
                  loading={isLoading?.server}
                  checked={server?.Status === 'enabled'}
                  onChange={onChangeSwitch}
                  style={{marginLeft: 10 + 'px'}}
                />
              </div>
            </div>
          )}
          <div className={s.table}>
            <TableMonitoring searchString={searchString} />
          </div>
        </div>
      </div>
      <div className={s.bottom_content}>
        <div className={s.bottom_top}>
          Chose MQTT Station
          <Select
            value={selected_mqtt}
            style={{width: 120, marginLeft: 20}}
            onChange={(v) => setSelected_Mqtt(v)}
            className={s.select}
            loading={isLoading?.units}
            disabled={isLoading?.units}
          >
            {mqtt_stations?.map((s) => (
              <Option value={s.ID_Station}>{s.Name}</Option>
            ))}
          </Select>
        </div>

        <div className={s.bottom_table_wrapper}>
          {selected_mqtt && <TableMonitoringUnit station={selected_mqtt} />}
        </div>

        {!isLoading.units && (
          <div className={s.add_wrapper}>
            <FormAdd ID_Station={selected_mqtt} />
          </div>
        )}
      </div>
    </div>
  );
}

export default MqttStation;

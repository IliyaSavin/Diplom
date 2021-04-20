import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../Loader/Loader';
import {setCurrentPageIndex} from '../../redux/features/stationsSlice';
import s from './Logs.module.sass';

import {Table, Checkbox} from 'antd';
import {
  getAllData,
  getAllUsers,
  selectAllLogs,
  selectAllUsers,
  selectLoading,
} from '../../redux/features/logsSlice';

import {Select} from 'antd';

import {DatePicker, Space, Input} from 'antd';
import moment from 'moment';
import {useHistory} from 'react-router';

const {RangePicker} = DatePicker;

const {Option} = Select;

const {Search} = Input;

const columns = [
  {
    title: 'Time',
    dataIndex: 'event_time',
    key: 'event_time',
    render: (text) => {
      var dateFormat = 'YYYY-MM-DD';

      return <b>{moment(text, dateFormat).format(dateFormat)}</b>;
    },
  },
  {
    title: 'Action',
    dataIndex: 'action_id',
    key: 'action_id',
  },
  {
    title: 'Succeeded',
    dataIndex: 'succeeded',
    key: 'succeeded',
  },
  {
    title: 'User name',
    key: 'server_principal_name',
    dataIndex: 'server_principal_name',
  },
  {
    title: 'Statement',
    key: 'statement',
    dataIndex: 'statement',
  },
  {
    title: 'Additional information',
    key: 'additional_information',
    dataIndex: 'additional_information',
  },
  {
    title: 'Client IP',
    key: 'client_ip',
    dataIndex: 'client_ip',
  },
  {
    title: 'Duration',
    key: 'duration_milliseconds',
    dataIndex: 'duration_milliseconds',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: 'loser',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

function Logs() {
  const dispatch = useDispatch();
  const history = useHistory();

  const allUsers = useSelector(selectAllUsers);
  const loading = useSelector(selectLoading);
  const logs = useSelector(selectAllLogs);

  const [selectedUser, setSelectedUser] = useState(0);
  const [order, setOrder] = useState('Up');
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [searchString, setSearchString] = useState('');

  var dateFormat = 'YYYY-MM-DD';

  const [dateEnd, setDateEnd] = useState(moment(new Date(), dateFormat));
  const [dateStart, setDateStart] = useState(
    moment(new Date(), dateFormat).subtract(1, 'days')
  );

  const parseSearch = () => {
    const searchStr = searchString ? `&${searchString}` : '';
    const string = `?order=${order}${searchStr}&onlyErrors=${onlyErrors}&dateFrom=${dateStart.format(
      dateFormat
    )}&dateTo=${dateEnd.format(dateFormat)}`;
    console.log(string);
    // history.push('/logs/' + string);
    return string;
  };

  parseSearch();

  useEffect(() => {
    dispatch(setCurrentPageIndex(['4']));
    dispatch(getAllUsers());
    dispatch(getAllData(parseSearch()));
  }, []);

  const onChange = (date, dateString) => {
    setDateStart(moment(dateString[0], dateFormat));
    setDateEnd(moment(dateString[1], dateFormat));

    dispatch(getAllData(parseSearch()));
  };

  if (loading) return <Loader />;

  return (
    <div className={s.logs}>
      <div className={s.header_wrapper}>
        <div className={s.wrappers_function}>
          <Search
            placeholder='Action ID or Statement'
            onSearch={() => {}}
            value={searchString}
            enterButton
          />
        </div>
        <div className={s.wrappers_function}>
          User:{' '}
          <Select
            style={{width: 170}}
            className={s.select}
            defaultValue={selectedUser}
          >
            {allUsers?.map((u, index) => (
              <Option key={index} value={index}>
                {u}
              </Option>
            ))}
          </Select>
        </div>
        <div className={s.wrappers_function}>
          <RangePicker
            defaultValue={[dateStart, dateEnd]}
            format={dateFormat}
            onChange={onChange}
          />
        </div>
        <div className={s.wrappers_function}>
          <Checkbox checked={onlyErrors} onChange={() => {}}>
            Only Errors
          </Checkbox>
        </div>
        <div className={s.wrappers_function}>
          Order:{' '}
          <Select style={{width: 80}} className={s.select} defaultValue={order}>
            <Option value='Up'>Up</Option>
            <Option value='Down'>Down</Option>
          </Select>
        </div>
      </div>
      <Table columns={columns} dataSource={logs} />
    </div>
  );
}

export default Logs;

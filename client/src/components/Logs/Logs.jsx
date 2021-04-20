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
    align: 'center',
    render: (text) => {
      var dateFormat = 'YYYY-MM-DD HH:mm:ss';

      return <b>{moment(text, dateFormat).format(dateFormat)}</b>;
    },
  },
  {
    title: 'Action',
    dataIndex: 'action_id',
    key: 'action_id',
    align: 'center',
  },
  {
    title: 'Succeeded',
    dataIndex: 'succeeded',
    key: 'succeeded',
    align: 'center',
    render: (text) => {
      return (
        <div className={s.wrap}>
          <div type={`${text}`} className={s.succeeded}></div>
        </div>
      );
    },
  },
  {
    title: 'User name',
    key: 'server_principal_name',
    dataIndex: 'server_principal_name',
    align: 'center',
  },
  {
    title: 'Statement',
    key: 'statement',
    dataIndex: 'statement',

    render: (text, record) => (
      <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>
        {text}
      </div>
    ),
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
    align: 'center',
  },
  {
    title: 'Duration',
    key: 'duration_milliseconds',
    dataIndex: 'duration_milliseconds',
    align: 'center',
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
  const [nextLoad, setNextLoad] = useState(false);

  var dateFormat = 'YYYY-MM-DD HH:mm:ss';

  const [dateEnd, setDateEnd] = useState(moment(new Date(), dateFormat));
  const [dateStart, setDateStart] = useState(
    moment(new Date(), dateFormat).subtract(1, 'days')
  );

  const parseSearch = () => {
    const searchStr = searchString ? `&searchString=${searchString}` : '';
    let string = '';
    if (allUsers?.length > 0) {
      string = `?order=${order}${searchStr}&onlyErrors=${onlyErrors}&dateFrom=${dateStart.format(
        dateFormat
      )}&dateTo=${dateEnd.format(dateFormat)}&user=${allUsers[selectedUser]}`;
    }

    console.log(string);
    // history.push('/logs/' + string);
    return string;
  };

  parseSearch();

  useEffect(() => {
    dispatch(setCurrentPageIndex(['4']));
    dispatch(getAllUsers());
    dispatch(getAllData(parseSearch()));
    setNextLoad(true);
  }, []);

  useEffect(() => {
    if (nextLoad) {
      dispatch(getAllData(parseSearch()));
    }
  }, [dateStart, dateEnd]);

  useEffect(() => {
    if (nextLoad) {
      dispatch(getAllData(parseSearch()));
    }
  }, [onlyErrors]);

  useEffect(() => {
    if (nextLoad) {
      dispatch(getAllData(parseSearch()));
    }
  }, [order]);

  useEffect(() => {
    if (nextLoad) {
      dispatch(getAllData(parseSearch()));
    }
  }, [selectedUser]);

  const onChange = (date, dateString) => {
    setDateStart(moment(dateString[0], dateFormat));
    setDateEnd(moment(dateString[1], dateFormat));
  };

  if (loading) return <Loader />;

  return (
    <div className={s.logs}>
      <div className={s.header_wrapper}>
        <div className={s.wrappers_function}>
          <Search
            placeholder='Action ID or Statement'
            value={searchString}
            enterButton
            onChange={(e) => setSearchString(e.currentTarget.value)}
            onSearch={() => dispatch(getAllData(parseSearch()))}
          />
        </div>
        <div className={s.wrappers_function}>
          User:{' '}
          <Select
            style={{width: 170}}
            className={s.select}
            defaultValue={selectedUser}
            onChange={(value) => setSelectedUser(value)}
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
            showTime
          />
        </div>
        <div className={s.wrappers_function}>
          <Checkbox
            checked={onlyErrors}
            onChange={() => setOnlyErrors(!onlyErrors)}
          >
            Only Errors
          </Checkbox>
        </div>
        <div className={s.wrappers_function}>
          Order:{' '}
          <Select
            style={{width: 80}}
            className={s.select}
            defaultValue={order}
            onChange={(value) => setOrder(value)}
          >
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

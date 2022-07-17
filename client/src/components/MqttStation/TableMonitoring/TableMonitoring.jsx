import moment from 'moment'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllMessages,
  selectAllMessages,
  selectIsLoading,
} from '../../../redux/features/mqttSlice'
import Loader from '../../Loader/Loader'
import { Table } from 'antd'

const columns = [
  {
    title: 'Topic',
    dataIndex: 'Topic',
    key: 'Topic',
    align: 'center',
  },
  {
    title: 'Value',
    dataIndex: 'Value',
    key: 'Value',
    align: 'center',
  },
  {
    title: 'Time',
    dataIndex: 'Message_Date',
    key: 'Message_Date',
    align: 'center',
    render: (text) => {
      var dateFormat = 'HH:mm:ss'
      let date = new Date(text)
      return <b>{moment(date, dateFormat).format(dateFormat)}</b>
    },
  },
]

function TableMonitoring({ searchString }) {
  const dispatch = useDispatch()
  const isLoading = useSelector(selectIsLoading)
  const messages = useSelector(selectAllMessages)

  useEffect(() => {
    dispatch(getAllMessages())
  }, [])

  if (isLoading?.monitoring)
    return (
      <div className='table-loading'>
        <Loader />
      </div>
    )
  return (
    <Table
      pagination={{ pageSize: 5, position: ['bottomCenter'] }}
      columns={columns}
      dataSource={messages}
    />
  )
}

export default TableMonitoring

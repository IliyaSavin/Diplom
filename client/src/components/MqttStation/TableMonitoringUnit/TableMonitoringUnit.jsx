import moment from 'moment'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteMessageUnit,
  getAllMessages,
  getMessageUnitList,
  selectAllMessages,
  selectIsLoading,
  selectMessageUnitList,
} from '../../../redux/features/mqttSlice'
import Loader from '../../Loader/Loader'
import { Table, Button, Modal } from 'antd'

function TableMonitoringUnit({ station }) {
  const columns = [
    {
      title: 'Message',
      dataIndex: 'Message',
      key: 'Message',
      align: 'center',
    },
    {
      title: 'Unit',
      dataIndex: 'Unit',
      key: 'Unit',
      align: 'center',
    },
    {
      title: 'Queue Number',
      dataIndex: 'Queue_Number',
      key: 'Queue_Number',
      align: 'center',
    },
    {
      title: 'Option',
      dataIndex: ['ID_Station', 'ID_Measured_Unit'],
      key: 'Option',
      align: 'center',
      render: (text, record) => {
        return (
          <Button
            type='primary'
            danger
            onClick={() => warning(record.ID_Station, record.ID_Measured_Unit)}
          >
            Delete
          </Button>
        )
      },
    },
  ]

  const dispatch = useDispatch()

  const isLoading = useSelector(selectIsLoading)
  const message_unit_list = useSelector(selectMessageUnitList)

  function warning(ID_Station, ID_Measured_Unit) {
    Modal.warning({
      title: 'Do you really want to delete?',
      centered: true,
      onOk() {
        dispatch(deleteMessageUnit(ID_Station, ID_Measured_Unit))
      },
      closable: true,
    })
  }

  useEffect(() => {
    if (station) dispatch(getMessageUnitList(station))
  }, [station])

  if (isLoading?.units)
    return (
      <div className='table-loading'>
        <Loader />
      </div>
    )
  return (
    <Table
      pagination={{ pageSize: 5, position: ['bottomCenter'] }}
      columns={columns}
      dataSource={message_unit_list}
    />
  )
}

export default TableMonitoringUnit

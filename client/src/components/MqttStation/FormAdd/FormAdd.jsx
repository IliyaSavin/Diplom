import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select } from 'antd'
import s from '../MqttStation.module.sass'
import { useDispatch, useSelector } from 'react-redux'

import {
  getAllUnits,
  selectAllUnitsList,
  selectIsLoading,
  addMessage,
  selectMessageUnitList,
} from '../../../redux/features/mqttSlice'

const { Option } = Select

function FormAdd({ ID_Station }) {
  const dispatch = useDispatch()
  const all_units = useSelector(selectAllUnitsList)
  const isLoading = useSelector(selectIsLoading)
  const message_unit_list = useSelector(selectMessageUnitList)

  const [formFields, setFormFields] = useState({
    message: '',
    unit: undefined,
    queue: '',
  })

  const [selectedUnit, setSelectedUnit] = useState(undefined)

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
  }

  useEffect(() => {
    dispatch(getAllUnits())
  }, [message_unit_list])

  useEffect(() => {
    if (all_units) setSelectedUnit(all_units[0].ID_Measured_Unit)
  }, [all_units])

  const onFinish = (values) => {
    if (ID_Station && selectedUnit)
      dispatch(
        addMessage(ID_Station, selectedUnit, values.message, values.queue)
      )
  }

  const onFinishFailed = () => {}

  return (
    <Form
      className={s.form_add}
      name='basic'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout='inline'
      validateTrigger='onSubmit'
    >
      <Form.Item
        name='message'
        rules={[
          { required: true, message: 'Please input message!' },
          {
            validator: async (rule, value) => {
              let exist = false
              message_unit_list?.map((m) => {
                if (m.Message === value) exist = true
              })
              if (exist && value !== undefined) {
                throw new Error('Something wrong!')
              }
            },
            message: 'Message already exist',
          },
        ]}
      >
        <Input
          style={{ width: 400 }}
          value={formFields.message}
          placeholder={'Message'}
          onChange={(e) =>
            setFormFields({ ...formFields, message: e.currentTarget.value })
          }
        />
      </Form.Item>

      <Form.Item
        name='unit'
        rules={[{ required: true, message: 'Please chose unit!' }]}
      >
        <Select
          defaultValue={null}
          value={selectedUnit}
          placeholder={'Chose unit'}
          disabled={isLoading?.unitsList}
          loading={isLoading?.unitsList}
          style={{ width: 200, height: 40 }}
          onChange={(v) => setSelectedUnit(v)}
        >
          {all_units
            ?.filter((un) => {
              let same = false
              message_unit_list?.map((m) => {
                if (un.ID_Measured_Unit === m.ID_Measured_Unit) same = true
              })
              return !same && un
            })
            .map((u) => (
              <Option value={u.ID_Measured_Unit}>
                {u.Title}, {u.Unit}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name='queue'
        rules={[
          { required: true, message: 'Please input queue number!' },
          {
            validator: async (rule, value) => {
              let exist = false
              message_unit_list?.map((m) => {
                if (+m.Queue_Number === +value) exist = true
              })
              if (exist) {
                throw new Error('Something wrong!')
              }
            },
            message: 'Queue number already exist',
          },
        ]}
      >
        <Input
          type={'number'}
          placeholder={'Queue number'}
          value={formFields.queue}
          onChange={(e) =>
            setFormFields({ ...formFields, queue: e.currentTarget.value })
          }
        />
      </Form.Item>

      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          size={'large'}
          style={{ width: '187px', marginTop: '10px' }}
        >
          Add
        </Button>
      </Form.Item>
    </Form>
  )
}

export default FormAdd

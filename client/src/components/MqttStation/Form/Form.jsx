import React, { useRef, useState } from 'react'
import { Form, Input, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { selectServer } from '../../../redux/features/mqttSlice'

import { addMqtt } from '../../../redux/features/mqttSlice'

function Formm() {
  const dispatch = useDispatch()
  const server = useSelector(selectServer)
  const ref = useRef()

  const [formFields, setFormFields] = useState({
    name: '',
    city: '',
    longitude: '',
    latitude: '',
  })

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
  }

  const onFinish = (values) => {
    if (server) {
      dispatch(
        addMqtt(
          values.city,
          values.name,
          server.ID_Server,
          values.longitude,
          values.latitude
        )
      )
      ref.current.resetFields()
    }
  }

  const onFinishFailed = () => {}
  return (
    <Form
      {...layout}
      ref={ref}
      name='basic'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <p style={{ textAlign: 'center', fontSize: 18 }}>MQTT</p>
      <Form.Item
        label='Name'
        name='name'
        rules={[{ required: true, message: 'Please input station name!' }]}
      >
        <Input
          value={formFields.name}
          onChange={(e) =>
            setFormFields({ ...formFields, name: e.currentTarget.value })
          }
        />
      </Form.Item>

      <Form.Item
        label='City'
        name='city'
        rules={[{ required: true, message: 'Please input city!' }]}
      >
        <Input
          value={formFields.city}
          onChange={(e) =>
            setFormFields({ ...formFields, city: e.currentTarget.value })
          }
        />
      </Form.Item>

      <Form.Item
        label='Longitude'
        name='longitude'
        rules={[{ required: true, message: 'Please input longitude!' }]}
      >
        <Input
          type={'number'}
          value={formFields.longitude}
          onChange={(e) =>
            setFormFields({ ...formFields, longitude: e.currentTarget.value })
          }
        />
      </Form.Item>

      <Form.Item
        label='Latitude'
        name='latitude'
        rules={[{ required: true, message: 'Please input latitude!' }]}
      >
        <Input
          type={'number'}
          value={formFields.latitude}
          onChange={(e) =>
            setFormFields({ ...formFields, latitude: e.currentTarget.value })
          }
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button
          type='primary'
          htmlType='submit'
          size={'large'}
          style={{ width: '187px', marginTop: '10px' }}
        >
          Confirm
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Formm

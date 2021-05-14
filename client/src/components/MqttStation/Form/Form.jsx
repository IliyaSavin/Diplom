import React, {useState} from 'react';
import {Form, Input, Button} from 'antd';
function Formm() {
  const [formFields, setFormFields] = useState({
    name: '',
    city: '',
    longitude: '',
    latitude: '',
  });

  const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
  };
  const tailLayout = {
    wrapperCol: {offset: 0, span: 24},
  };

  const onFinish = () => {};

  const onFinishFailed = () => {};
  return (
    <Form
      {...layout}
      name='basic'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <p style={{textAlign: 'center', fontSize: 18}}>MQTT</p>
      <Form.Item
        label='Name'
        name='name'
        rules={[{required: true, message: 'Please input station name!'}]}
      >
        <Input
          value={formFields.name}
          onChange={(e) =>
            setFormFields({...formFields, name: e.currentTarget.value})
          }
        />
      </Form.Item>

      <Form.Item
        label='City'
        name='city'
        rules={[{required: true, message: 'Please input city!'}]}
      >
        <Input
          value={formFields.city}
          onChange={(e) =>
            setFormFields({...formFields, city: e.currentTarget.value})
          }
        />
      </Form.Item>

      <Form.Item
        label='Longitude'
        name='longitude'
        rules={[{required: true, message: 'Please input longitude!'}]}
      >
        <Input
          value={formFields.longitude}
          onChange={(e) =>
            setFormFields({...formFields, longitude: e.currentTarget.value})
          }
        />
      </Form.Item>

      <Form.Item
        label='Latitude'
        name='latitude'
        rules={[{required: true, message: 'Please input latitude!'}]}
      >
        <Input
          value={formFields.latitude}
          onChange={(e) =>
            setFormFields({...formFields, latitude: e.currentTarget.value})
          }
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button
          type='primary'
          htmlType='submit'
          size={'large'}
          style={{width: '187px', marginTop: '10px'}}
        >
          Confirm
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Formm;

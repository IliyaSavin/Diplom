import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select} from 'antd';
import s from '../MqttStation.module.sass';
import {useDispatch, useSelector} from 'react-redux';

import {
  getAllUnits,
  selectAllUnitsList,
  selectIsLoading,
  addMessage,
} from '../../../redux/features/mqttSlice';

const {Option} = Select;

function FormAdd({ID_Station}) {
  const dispatch = useDispatch();
  const all_units = useSelector(selectAllUnitsList);
  const isLoading = useSelector(selectIsLoading);

  const [formFields, setFormFields] = useState({
    message: '',
    unit: undefined,
    queue: '',
  });

  const [selectedUnit, setSelectedUnit] = useState(undefined);

  const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
  };
  const tailLayout = {
    wrapperCol: {offset: 0, span: 24},
  };

  useEffect(() => {
    dispatch(getAllUnits());
  }, []);

  useEffect(() => {
    if (all_units) setSelectedUnit(all_units[0].ID_Measured_Unit);
  }, [all_units]);

  const onFinish = (values) => {
    if (ID_Station && selectedUnit)
      dispatch(
        addMessage(ID_Station, selectedUnit, values.message, values.queue)
      );
  };

  const onFinishFailed = () => {};
  console.log(selectedUnit, 'selecteddddddddddddddddddddddd');

  return (
    <Form
      className={s.form_add}
      name='basic'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout='inline'
    >
      <Form.Item
        name='message'
        rules={[{required: true, message: 'Please input message!'}]}
      >
        <Input
          style={{width: 400}}
          value={formFields.message}
          placeholder={'Message'}
          onChange={(e) =>
            setFormFields({...formFields, message: e.currentTarget.value})
          }
        />
      </Form.Item>

      <Form.Item
        name='unit'
        rules={[{required: true, message: 'Please chose unit!'}]}
      >
        <Select
          defaultValue={null}
          value={selectedUnit}
          placeholder={'Chose unit'}
          disabled={isLoading?.unitsList}
          loading={isLoading?.unitsList}
          style={{width: 200, height: 40}}
          onChange={(v) => setSelectedUnit(v)}
        >
          {all_units?.map((u) => (
            <Option value={u.ID_Measured_Unit}>
              {u.Title}, {u.Unit}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name='queue'
        rules={[{required: true, message: 'Please input queue number!'}]}
      >
        <Input
          type={'number'}
          placeholder={'Queue number'}
          value={formFields.queue}
          onChange={(e) =>
            setFormFields({...formFields, queue: e.currentTarget.value})
          }
        />
      </Form.Item>

      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          size={'large'}
          style={{width: '187px', marginTop: '10px'}}
        >
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}

export default FormAdd;

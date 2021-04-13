import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectLogin,
  selectPassword,
  selectErrors,
  selectSuccess,
  setLogin,
  setPassword,
  addUser,
  setSuccess,
} from '../../redux/features/userSlice';
import s from './CreateUser.module.sass';
import {Form, Input, Button, Modal} from 'antd';
import {setCurrentPageIndex} from '../../redux/features/stationsSlice';

function CreateUser() {
  const dispatch = useDispatch();

  const login = useSelector(selectLogin);
  const password = useSelector(selectPassword);
  const errors = useSelector(selectErrors);
  const successs = useSelector(selectSuccess);

  const ref = useRef(null);

  const [closed, setClosed] = useState(false);

  function success() {
    Modal.success({
      content: 'User Added',
      centered: true,
      onOk() {
        setClosed(true);
      },
    });
  }

  useEffect(() => {
    if (successs) success();
  }, [successs]);

  useEffect(() => {
    if (closed && successs) {
      dispatch(setLogin(''));
      dispatch(setPassword(''));
      dispatch(setSuccess(undefined));
    }
  }, [closed]);

  useEffect(() => {
    dispatch(setCurrentPageIndex(['2']));

    return () => {
      dispatch(setSuccess(undefined));
      dispatch(setLogin(''));
      dispatch(setPassword(''));
    };
  }, []);

  const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  };
  const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
  };

  const onFinish = (values) => {
    console.log('Success:', values);
    dispatch(addUser(login, password));
    ref.current.resetFields();
  };

  const validator = async (rule, value) => {
    let val = value.match(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{10,}/g);

    if (val === null) {
      throw new Error('Something wrong!');
    }
  };

  return (
    <div className={s.createUser}>
      <h2>Create User</h2>
      <div className={s.errors}>{errors}</div>
      <Form
        ref={ref}
        {...layout}
        name='basic'
        initialValues={{remember: true}}
        onFinish={onFinish}
        validateTrigger='onSubmit'
      >
        <Form.Item
          label='Username'
          name='username'
          rules={[{required: true, message: 'Please input username!'}]}
        >
          <Input
            style={{width: 305}}
            value={login}
            onChange={(e) => dispatch(setLogin(e.target.value))}
          />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            {required: true, message: 'Please input password!'},
            {
              validator,
              message:
                'Password length must be 10, and contains one upper symbol',
            },
          ]}
        >
          <Input.Password
            style={{width: 305}}
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit' style={{width: 305}}>
            Create User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateUser;

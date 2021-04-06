import React, {useEffect} from 'react';
import './LoginPage.sass';

import {Form, Input, Button} from 'antd';
import {Redirect} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
  loginUser,
  selectErrorLog,
  selectIsAuth,
  selectLoginString,
  selectPasswordString,
  setAuth,
  setLogString,
  setPassString,
} from '../../redux/features/authSlice';

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};
const tailLayout = {
  wrapperCol: {offset: 8, span: 16},
};

const LoginPage = React.memo(({history}) => {
  const auth = useSelector(selectIsAuth);
  const log = useSelector(selectLoginString);
  const pass = useSelector(selectPasswordString);
  const errorLog = useSelector(selectErrorLog);

  const dispatch = useDispatch();

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      dispatch(setAuth(true));
    }
  }, []);

  const onChangeLog = (e) => {
    dispatch(setLogString(e.currentTarget.value));
  };

  const onChangePass = (e) => {
    dispatch(setPassString(e.currentTarget.value));
  };

  const onFinish = (values) => {
    dispatch(loginUser(values.login, values.password));
    console.log(errorLog);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (auth) return <Redirect to={'/'} />;
  return (
    <div className={'login'}>
      <Form
        {...layout}
        name='basic'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {errorLog && (
          <div
            style={{textAlign: 'center', color: 'red', marginBottom: '30px'}}
          >
            {errorLog}
          </div>
        )}
        <Form.Item
          label='Username'
          name='login'
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Input value={log} onChange={onChangeLog} />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{required: true, message: 'Please input your password!'}]}
        >
          <Input.Password value={pass} onChange={onChangePass} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type='primary'
            htmlType='submit'
            size={'large'}
            style={{width: '187px', marginTop: '10px'}}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default LoginPage;

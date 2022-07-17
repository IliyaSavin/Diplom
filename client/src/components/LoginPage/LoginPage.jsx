import React, { useEffect } from 'react'
import './LoginPage.sass'
import Logo from '../../img/logo.png'

import { Form, Input, Button, Row } from 'antd'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  loginUser,
  selectErrorLog,
  selectIsAuth,
  selectLoginString,
  selectPasswordString,
  setAuth,
  setLogString,
  setPassString,
} from '../../redux/features/authSlice'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const LoginPage = React.memo(({ history }) => {
  const auth = useSelector(selectIsAuth)
  const log = useSelector(selectLoginString)
  const pass = useSelector(selectPasswordString)
  const errorLog = useSelector(selectErrorLog)
  const isLoadingAuth = useSelector((state) => state.auth.isLoadingAuth)

  const dispatch = useDispatch()

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      dispatch(setAuth(true))
    }
  }, [dispatch])

  const onChangeLog = (e) => {
    dispatch(setLogString(e.currentTarget.value))
  }

  const onChangePass = (e) => {
    dispatch(setPassString(e.currentTarget.value))
  }

  const onFinish = (values) => {
    dispatch(loginUser(values.login, values.password))
  }

  const onFinishFailed = (errorInfo) => {}

  if (auth) return <Navigate to={'/stations/?order=idUp'} />
  return (
    <div className='container-xxl login-page d-flex align-items-center justify-content-center'>
      <div className='row w-100'>
        <div className='col-md-7 col-12 text-center mb-5 mb-md-0'>
          <img className='w-100 ' src={Logo} alt='' />
          <p className='mb-0 login-admin-text'>Admin</p>
        </div>
        <div className='col-md-5 col-12 d-flex align-items-center justify-content-center mt-5 mt-md-0'>
          <Form
            {...layout}
            name='basic'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className='login-form'
          >
            {errorLog && (
              <div
                style={{
                  textAlign: 'center',
                  color: 'red',
                  marginBottom: '30px',
                }}
              >
                {errorLog}
              </div>
            )}
            <Form.Item
              label='Username'
              name='login'
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input value={log} onChange={onChangeLog} />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password value={pass} onChange={onChangePass} />
            </Form.Item>

            <Form.Item {...tailLayout} className='login-submit-btn'>
              <Button
                type='primary'
                htmlType='submit'
                size={'large'}
                style={{ width: '100%', marginTop: '10px' }}
                disabled={isLoadingAuth}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
})

export default LoginPage

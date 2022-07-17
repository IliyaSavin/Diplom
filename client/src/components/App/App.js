import React, { useEffect } from 'react'

import 'antd/dist/antd.css'
import './App.module.sass'

import LoginPage from '../LoginPage/LoginPage'
import Header from '../Header'
import StationsPage from '../StationsPage/StationsPage'
import CreateUser from '../СreateUser/CreateUser'
import AddStation from '../AddStation/AddStation'
import MqttStation from '../MqttStation/MqttStation'
import Logs from '../Logs/Logs'
import Report from '../Report/Report'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsAuth, setAuth } from '../../redux/features/authSlice'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const App = () => {
  const auth = useSelector(selectIsAuth)
  let navigate = useNavigate()
  let dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    if (!sessionStorage.getItem('token')) navigate('/login')
    else dispatch(setAuth(true))
  }, [auth, navigate, dispatch])

  if (location.pathname === '/') navigate('/stations')

  return (
    <div className='app'>
      <main style={{ minHeight: '100vh' }}>
        {auth && <Header />}
        <div className='container-xxl'>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/stations/*' element={<StationsPage />} />
            <Route path='/createuser' element={<CreateUser />} />
            <Route path='/addstation' element={<AddStation />} />
            <Route path='/mqtt' element={<MqttStation />} />
            <Route path='/logs' element={<Logs />} />
            <Route path='/report' element={<Report />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App

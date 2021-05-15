import {Button, Layout, Menu} from 'antd';
import {RadarChartOutlined} from '@ant-design/icons';
import React, {useState} from 'react';
import {Link, Redirect, Route, Switch, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {selectIsAuth, setAuth} from '../../redux/features/authSlice';
import StationsPage from '../StationsPage/StationsPage';
import CreateUser from '../СreateUser/CreateUser';
import {selectCurrentPageIndex} from '../../redux/features/stationsSlice';
import AddStation from '../AddStation/AddStation';
import s from './LayoutApp.module.sass';
import Logs from '../Logs/Logs';
import Report from '../Report/Report';
import MqttStation from '../MqttStation/MqttStation';

const {SubMenu} = Menu;
const {Content, Sider} = Layout;
const LayoutApp = () => {
  const auth = useSelector(selectIsAuth);
  const index = useSelector(selectCurrentPageIndex);
  const dispatch = useDispatch();

  if (!auth) return <Redirect to={'/login'} />;

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Layout>
        <Sider collapsible width={200} className='site-layout-background'>
          <Menu
            theme='dark'
            mode='inline'
            selectedKeys={index}
            defaultOpenKeys={['sub1']}
            style={{height: '100%', borderRight: 0}}
          >
            <SubMenu
              key='sub1'
              icon={<RadarChartOutlined />}
              title='Admin Panel'
              className={s.sub1}
            >
              <Menu.Item key='1'>
                <Link to='/'>Overview</Link>
              </Menu.Item>
              <Menu.Item key='2'>
                <Link to='/createuser'>Create User</Link>
              </Menu.Item>
              <Menu.Item key='3'>
                <Link to='/addstation'>Add Station</Link>
              </Menu.Item>
              <Menu.Item key='3.1'>
                <Link to='/mqtt'>Add MQTT</Link>
              </Menu.Item>
              <Menu.Item key='4'>
                <Link to='/logs'>Activity Logs</Link>
              </Menu.Item>
              <Menu.Item key='5'>
                <Link to='/report'>Report</Link>
              </Menu.Item>
              <Menu.Item key='6'>
                <Button
                  type='primary'
                  danger
                  style={{width: 100 + '%', paddingRight: 70 + 'px'}}
                  onClick={() => {
                    dispatch(setAuth(false));
                    sessionStorage.removeItem('token');
                  }}
                >
                  <Link to='/login'>Log out</Link>
                </Button>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{padding: '0 24px 24px'}}>
          <Content
            className='site-layout-background'
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Switch>
              <Route exact path='/' component={StationsPage} />
              <Route exact path='/createuser' component={CreateUser} />
              <Route exact path='/addstation' component={AddStation} />
              <Route exact path='/mqtt' component={MqttStation} />
              <Route exact path='/logs' component={Logs} />
              <Route exact path='/report' component={Report} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;
// іві

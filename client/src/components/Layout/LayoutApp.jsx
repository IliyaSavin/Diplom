import {Layout, Menu} from 'antd';
import {RadarChartOutlined} from '@ant-design/icons';
import React, {useState} from 'react';
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectIsAuth} from '../../redux/features/authSlice';

const {SubMenu} = Menu;
const {Content, Sider} = Layout;
const LayoutApp = () => {
  const auth = useSelector(selectIsAuth);

  if (!auth) return <Redirect to={'/login'} />;

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Layout>
        <Sider collapsible width={200} className='site-layout-background'>
          <Menu
            theme='dark'
            mode='inline'
            selectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{height: '100%', borderRight: 0}}
          >
            <SubMenu key='sub1' icon={<RadarChartOutlined />} title='Stations'>
              <Menu.Item key='1'>
                <Link to='/'>Overview</Link>
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
            <Switch></Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;

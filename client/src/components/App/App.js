import React from 'react';

import 'antd/dist/antd.css';
import './App.module.sass';

import {Switch, Route} from 'react-router-dom';
import {withSuspense} from '../../hoc/withSuspense/withSuspense';
import LoginPage from '../LoginPage/LoginPage';

const LayoutLazy = React.lazy(() => import('../Layout/LayoutApp'));

const SuspendedLayout = withSuspense(LayoutLazy);

function App() {
  return (
    <div className='app'>
      <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/' component={SuspendedLayout} />
      </Switch>
    </div>
  );
}

export default App;

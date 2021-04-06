import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './redux/store/store';

const Root = ({store, children}) => (
  <Provider store={store}>{children}</Provider>
);

ReactDOM.render(
  <Root store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Root>,
  document.getElementById('root')
);

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App/App'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store/store'
import { QueryParamProvider } from 'use-query-params'

const Root = ({ store, children }) => (
  <Provider store={store}>{children}</Provider>
)

ReactDOM.render(
  <Root store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Root>,
  document.getElementById('root')
)

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import { Provider } from 'react-redux';
import { initSocket } from 'utils/socket';
import getRoutes from './routes';

// Global CSS
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css';

const client = new ApiClient();
const store = createStore(client, window.__data);

initSocket();

const routes = getRoutes(store);
const supportsHistory = 'pushState' in window.history;
const app = (
  <Provider store={store}>
    <BrowserRouter forceRefresh={!supportsHistory}>
      {routes}
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

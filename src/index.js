/* global module */
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import startMirage from '../mirage';

import App from './components/app';

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <App/>
    </AppContainer>,
    document.getElementById('react-root')
  );
};

if (module.hot) {
  module.hot.accept('./components/app', render);
}

if (process.env.NODE_ENV === 'development') {
  window.mirage = startMirage();
}

render();

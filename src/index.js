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

window.mirage = startMirage();

render();

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import View from '../components/settings';
import ApplicationRoute from './application';

export default class SettingsRoute extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let { children } = this.props;
    let { router } = this.context;

    return (
      <ApplicationRoute showSettings>
        <View activeLink={router.route.location.pathname}>
          {children}
        </View>
      </ApplicationRoute>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import { ProxyType } from '../redux/application';
import View from '../components/settings-root-proxy';

class SettingsRootProxyRoute extends Component {
  static propTypes = {
    proxyTypes: PropTypes.object.isRequired,
    getProxyTypes: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.getProxyTypes();
  }

  render() {
    let { proxyTypes } = this.props;

    return (
      <View
        proxyTypes={proxyTypes}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => ({
    proxyTypes: createResolver(data).query('proxyTypes')
  }), {
    getProxyTypes: () => ProxyType.query()
  }
)(SettingsRootProxyRoute);

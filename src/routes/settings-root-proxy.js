import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import { RootProxy } from '../redux/application';
import View from '../components/settings-root-proxy';

class SettingsRootProxyRoute extends Component {
  static propTypes = {
    rootProxies: PropTypes.object.isRequired,
    getRootProxies: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.getRootProxies();
  }

  render() {
    let { rootProxies } = this.props;

    return (
      <View
        rootProxies={rootProxies}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => ({
    rootProxies: createResolver(data).query('root-proxies')
  }), {
    getRootProxies: () => RootProxy.query()
  }
)(SettingsRootProxyRoute);

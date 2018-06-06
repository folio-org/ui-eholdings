import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import { ProxyType, RootProxy } from '../redux/application';
import View from '../components/settings-root-proxy';

class SettingsRootProxyRoute extends Component {
  static propTypes = {
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getRootProxy: PropTypes.func.isRequired,
    updateRootProxy: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.getProxyTypes();
    this.props.getRootProxy();
  }

  rootProxySubmitted = (values) => {
    let { rootProxy, updateRootProxy } = this.props;

    rootProxy.proxyTypeId = values.rootProxyServer;

    updateRootProxy(rootProxy);
  }

  render() {
    let { proxyTypes, rootProxy } = this.props;

    return (
      <View
        initialValues={{
          rootProxyServer: rootProxy.proxyTypeId
        }}
        proxyTypes={proxyTypes}
        rootProxy={rootProxy}
        onSubmit={this.rootProxySubmitted}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => ({
    proxyTypes: createResolver(data).query('proxyTypes'),
    rootProxy: createResolver(data).find('rootProxies', 'root-proxy')
  }), {
    getProxyTypes: () => ProxyType.query(),
    getRootProxy: () => RootProxy.find('root-proxy'),
    updateRootProxy: model => RootProxy.save(model)
  }
)(SettingsRootProxyRoute);

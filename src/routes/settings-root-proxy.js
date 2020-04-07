import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';

import { createResolver } from '../redux';
import { ProxyType } from '../redux/application';
import { getRootProxy, updateRootProxy, confirmUpdateRootProxy } from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';
import { rootProxy } from '../constants';
import View from '../components/settings/settings-root-proxy';

class SettingsRootProxyRoute extends Component {
  static propTypes = {
    confirmUpdateRootProxy: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getRootProxy: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: rootProxy.RootProxyReduxStateShape.isRequired,
    updateRootProxy: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { getProxyTypes, getRootProxy, match: { params } } = this.props;

    getProxyTypes();
    getRootProxy(params.kbId);
  }

  componentDidUpdate() {
    const { history, rootProxy, confirmUpdateRootProxy, match: { params } } = this.props;

    if (rootProxy.isUpdated) {
      history.push({
        pathname: `/settings/eholdings/${params.kbId}/root-proxy`,
        state: { eholdings: true, isFreshlySaved: true }
      });

      confirmUpdateRootProxy();
    }
  }

  rootProxySubmitted = (values) => {
    const { rootProxy, updateRootProxy, match: { params } } = this.props;

    const rootProxyData = rootProxy.data;
    rootProxyData.attributes.proxyTypeId = values.rootProxyServer;

    updateRootProxy(rootProxyData, params.kbId);
  }

  render() {
    const { proxyTypes, rootProxy } = this.props;

    return (
      <FormattedMessage id="ui-eholdings.label.settings">
        {pageLabel => (
          <FormattedMessage id="ui-eholdings.settings.rootProxy">
            {recordLabel => (
              <TitleManager
                page={pageLabel}
                record={recordLabel}
              >
                <View
                  proxyTypes={proxyTypes}
                  rootProxy={rootProxy}
                  onSubmit={this.rootProxySubmitted}
                />
              </TitleManager>
            )}
          </FormattedMessage>
        )}
      </FormattedMessage>
    );
  }
}

export default connect(
  (store) => {
    const { data } = store.eholdings;

    return {
      proxyTypes: createResolver(data).query('proxyTypes'),
      rootProxy: selectPropFromData(store, 'settingsRootProxy'),
    };
  }, {
    getProxyTypes: () => ProxyType.query(),
    getRootProxy,
    updateRootProxy,
    confirmUpdateRootProxy,
  }
)(SettingsRootProxyRoute);

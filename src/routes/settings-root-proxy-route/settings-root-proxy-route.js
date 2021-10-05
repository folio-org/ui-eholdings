import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';

import View from '../../components/settings/settings-root-proxy';

import { rootProxy as rootProxyShapes } from '../../constants';

export default class SettingsRootProxyRoute extends Component {
  static propTypes = {
    confirmUpdateRootProxy: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getRootProxy: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: rootProxyShapes.RootProxyReduxStateShape.isRequired,
    updateRootProxy: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { getProxyTypes, getRootProxy, match: { params } } = this.props;

    getProxyTypes(params.kbId);
    getRootProxy(params.kbId);
  }

  componentDidUpdate(prevProps) {
    const {
      history,
      rootProxy,
      confirmUpdateRootProxy,
      match: { params },
      getProxyTypes,
      getRootProxy,
    } = this.props;

    if (rootProxy.isUpdated) {
      history.push({
        pathname: `/settings/eholdings/${params.kbId}/root-proxy`,
        state: { eholdings: true, isFreshlySaved: true }
      });

      confirmUpdateRootProxy();
    }

    if (prevProps.match.params.kbId !== params.kbId) {
      getProxyTypes(params.kbId);
      getRootProxy(params.kbId);
    }
  }

  rootProxySubmitted = (values) => {
    const { rootProxy, updateRootProxy, match: { params } } = this.props;

    const { credentialsId, ...rootProxyData } = rootProxy.data;
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

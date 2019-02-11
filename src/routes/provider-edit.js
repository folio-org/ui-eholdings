import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import queryString from 'qs';
import { TitleManager } from '@folio/stripes/core';

import { createResolver } from '../redux';
import Provider from '../redux/provider';
import { ProxyType, RootProxy } from '../redux/application';

import View from '../components/provider/edit';

class ProviderEditRoute extends Component {
  static propTypes = {
    getProvider: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getRootProxy: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired,
    updateProvider: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    let { match, getProvider, getProxyTypes, getRootProxy } = props;
    let { providerId } = match.params;
    getProvider(providerId);
    getProxyTypes();
    getRootProxy();
  }


  componentDidUpdate(prevProps) {
    let { match, getProvider, history, location, model } = this.props;
    let { providerId } = match.params;

    if (providerId !== prevProps.match.params.providerId) {
      getProvider(providerId);
    }

    let wasPending = prevProps.model.update.isPending && !model.update.isPending;
    let needsUpdate = !isEqual(prevProps.model, model);
    let isRejected = model.update.isRejected;

    if (wasPending && needsUpdate && !isRejected) {
      history.push({
        pathname: `/eholdings/providers/${model.id}`,
        search: location.search,
        state: { eholdings: true, isFreshlySaved: true }
      });
    }
  }

  providerEditSubmitted = (values) => {
    let { model, updateProvider } = this.props;
    model.proxy.id = values.proxyId;
    model.providerToken.value = values.providerTokenValue;
    updateProvider(model);
  };

  getSearchType = () => {
    const { searchType } = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
    return searchType;
  }

  handleFullView = () => {
    const {
      history,
      model,
    } = this.props;

    const fullViewRouteState = {
      pathname: `/eholdings/providers/${model.id}/edit`,
      state: { eholdings: true },
    };

    history.push(fullViewRouteState);
  }

  handleCancel = () => {
    const {
      history,
      model,
      location,
    } = this.props;

    const viewRouteState = {
      pathname: `/eholdings/providers/${model.id}`,
      search: location.search,
      state: {
        eholdings: true,
      }
    };

    if (this.getSearchType()) {
      history.push(viewRouteState);
    }

    history.replace(viewRouteState);
  }

  render() {
    const {
      model,
      proxyTypes,
      rootProxy,
    } = this.props;

    return (
      <TitleManager record={`Edit ${this.props.model.name}`}>
        <View
          model={model}
          onSubmit={this.providerEditSubmitted}
          onCancel={this.handleCancel}
          proxyTypes={proxyTypes}
          rootProxy={rootProxy}
          onFullView={this.getSearchType() && this.handleFullView}
        />
      </TitleManager>
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('providers', match.params.providerId),
    proxyTypes: createResolver(data).query('proxyTypes'),
    rootProxy: createResolver(data).find('rootProxies', 'root-proxy')
  }), {
    getProvider: id => Provider.find(id),
    updateProvider: model => Provider.save(model),
    getProxyTypes: () => ProxyType.query(),
    getRootProxy: () => RootProxy.find('root-proxy')
  }
)(ProviderEditRoute);

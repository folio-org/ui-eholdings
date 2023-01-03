import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import isEqual from 'lodash/isEqual';
import queryString from 'qs';
import { TitleManager } from '@folio/stripes/core';

import View from '../../components/provider/edit';

export default class ProviderEditRoute extends Component {
  static propTypes = {
    getProvider: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getRootProxy: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    removeUpdateRequests: PropTypes.func.isRequired,
    rootProxy: PropTypes.object.isRequired,
    updateProvider: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { match, getProvider, getProxyTypes, getRootProxy } = props;
    const { providerId } = match.params;
    getProvider(providerId);
    getProxyTypes();
    getRootProxy();
  }


  componentDidUpdate(prevProps) {
    const { match, getProvider, history, location, model } = this.props;
    const { providerId } = match.params;

    if (providerId !== prevProps.match.params.providerId) {
      getProvider(providerId);
    }

    const wasPending = prevProps.model.update.isPending && !model.update.isPending;
    const needsUpdate = !isEqual(prevProps.model, model);
    const isRejected = model.update.isRejected;

    if (wasPending && needsUpdate && !isRejected) {
      history.replace({
        pathname: `/eholdings/providers/${model.id}`,
        search: location.search,
        state: { eholdings: true, isFreshlySaved: true }
      });
    }
  }

  componentWillUnmount() {
    this.props.removeUpdateRequests();
  }

  providerEditSubmitted = (values) => {
    const { model, updateProvider } = this.props;
    model.proxy.id = values.proxyId;
    model.providerToken.value = values.providerTokenValue;
    updateProvider(model);
  };

  getSearchType = () => {
    const { searchType } = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
    return searchType;
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
        />
      </TitleManager>
    );
  }
}


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import queryString from 'qs';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import { createResolver } from '../redux';
import { ProxyType } from '../redux/application';
import Package from '../redux/package';
import Provider from '../redux/provider';
import Resource from '../redux/resource';

import View from '../components/package/package-edit';

class PackageEditRoute extends Component {
  static propTypes = {
    destroyPackage: PropTypes.func.isRequired,
    getPackage: PropTypes.func.isRequired,
    getProvider: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    unloadResources: PropTypes.func.isRequired,
    updatePackage: PropTypes.func.isRequired,
    updateProvider: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    let { packageId } = props.match.params;
    let [providerId] = packageId.split('-');
    props.getPackage(packageId);
    props.getProxyTypes();
    props.getProvider(providerId);
  }

  componentDidUpdate(prevProps) {
    let {
      model: next,
      match,
      getPackage,
      unloadResources,
      history,
      location
    } = this.props;
    let {
      model: old,
      match: oldMatch
    } = prevProps;
    let { packageId } = match.params;

    if (!prevProps.model.destroy.isResolved && next.destroy.isResolved) {
      // if package was reached based on search
      if (location.search) {
        history.replace({
          pathname: '/eholdings',
          search: this.props.location.search
        }, { eholdings: true });
        // package was reached directly from url not by search
      } else {
        history.replace('/eholdings?searchType=packages', { eholdings: true });
      }
    }

    if (packageId !== oldMatch.params.packageId) {
      getPackage(packageId);
    // if an update just resolved, unfetch the package titles
    } else if (next.update.isResolved && old.update.isPending) {
      unloadResources(next.resources);
    }

    let wasPending = prevProps.model.update.isPending && !next.update.isPending;
    let needsUpdate = !isEqual(prevProps.model, next);
    let isRejected = this.props.model.update.isRejected;
    let wasUnSelected = prevProps.model.isSelected && !next.isSelected;
    let isCurrentlySelected = prevProps.model.isSelected && next.isSelected;

    if (wasPending && needsUpdate && !isRejected && (wasUnSelected || isCurrentlySelected)) {
      this.props.history.push({
        pathname: `/eholdings/packages/${next.id}`,
        search: this.props.location.search,
        state: { eholdings: true, isFreshlySaved: true }
      });
    }
  }

  providerEditSubmitted = (values) => {
    let { provider, updateProvider } = this.props;
    provider.providerToken.value = values.providerTokenValue;
    updateProvider(provider);
  };

  packageEditSubmitted = (values) => {
    let { model, updatePackage, destroyPackage } = this.props;
    // if the package is custom setting the holding status to false
    // or deselecting the package will delete the package from holdings
    if (model.isCustom && values.isSelected === false) {
      destroyPackage(model);
    } else if (values.isSelected === false) {
      // When de-selecting a managed package
      // need to clear out customizations before sending to server
      model.isSelected = false;
      model.visibilityData.isHidden = false;
      model.customCoverage = {};
      model.allowKbToAddTitles = false;
      updatePackage(model);
    } else if (values.isSelected && !values.customCoverages) {
      model.isSelected = true;
      model.allowKbToAddTitles = true;
      updatePackage(model);
    } else {
      let beginCoverage = '';
      let endCoverage = '';

      if (values.customCoverages[0]) {
        beginCoverage = !values.customCoverages[0].beginCoverage ? '' : moment.utc(values.customCoverages[0].beginCoverage).format('YYYY-MM-DD');
        endCoverage = !values.customCoverages[0].endCoverage ? '' : moment.utc(values.customCoverages[0].endCoverage).format('YYYY-MM-DD');
      }

      model.customCoverage = {
        beginCoverage,
        endCoverage
      };

      if ('isSelected' in values) {
        model.isSelected = values.isSelected;
      }

      if ('isVisible' in values) {
        model.visibilityData.isHidden = !values.isVisible;
      }

      if ('allowKbToAddTitles' in values) {
        model.allowKbToAddTitles = values.allowKbToAddTitles;
      }

      if ('name' in values) {
        model.name = values.name;
      }

      if ('contentType' in values) {
        model.contentType = values.contentType;
      }

      if ('proxyId' in values) {
        model.proxy.id = values.proxyId;
        model.proxy.inherited = false;
      }

      if ('packageTokenValue' in values) {
        model.packageToken.value = values.packageTokenValue;
      }

      if ('providerTokenValue' in values) {
        this.providerEditSubmitted(values);
      }

      updatePackage(model);
    }
  };

  /* This method is common between package-show and package-edit routes
   * This should be refactored once we can share model between the routes.
  */
  addPackageToHoldings = () => {
    let { model, updatePackage } = this.props;
    model.isSelected = true;
    model.selectedCount = model.titleCount;
    model.allowKbToAddTitles = true;
    updatePackage(model);
  };

  render() {
    let { model, proxyTypes, provider, history, location } = this.props;
    const { searchType } = queryString.parse(location.search, { ignoreQueryPrefix: true });

    return (
      <FormattedMessage id="ui-eholdings.label.editLink" values={{ name: model.name }}>
        {pageTitle => (
          <TitleManager record={pageTitle}>
            <View
              model={model}
              proxyTypes={proxyTypes}
              provider={provider}
              onSubmit={this.packageEditSubmitted}
              onCancel={() => history.push({
                pathname: `/eholdings/packages/${model.id}`,
                search: location.search,
                state: { eholdings: true }
              })}
              addPackageToHoldings={this.addPackageToHoldings}
              fullViewLink={searchType && {
                to: {
                  pathname: `/eholdings/packages/${model.id}/edit`,
                  state: { eholdings: true }
                }
              }}
            />
          </TitleManager>
        )}
      </FormattedMessage>
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => {
    let resolver = createResolver(data);
    let model = resolver.find('packages', match.params.packageId);
    return {
      model,
      proxyTypes: resolver.query('proxyTypes'),
      provider: resolver.find('providers', model.providerId),
      resolver
    };
  }, {
    getPackage: id => Package.find(id),
    getProxyTypes: () => ProxyType.query(),
    getProvider: id => Provider.find(id),
    unloadResources: collection => Resource.unload(collection),
    updateProvider: provider => Provider.save(provider),
    updatePackage: model => Package.save(model),
    destroyPackage: model => Package.destroy(model)
  }
)(PackageEditRoute);

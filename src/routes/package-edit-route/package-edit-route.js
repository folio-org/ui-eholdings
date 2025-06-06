import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import isEqual from 'lodash/isEqual';
import { FormattedMessage } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { dayjs } from '@folio/stripes/components';

import View from '../../components/package/package-edit';

import {
  accessTypes,
  accessTypesReduxStateShape,
} from '../../constants';

class PackageEditRoute extends Component {
  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    destroyPackage: PropTypes.func.isRequired,
    getAccessTypes: PropTypes.func.isRequired,
    getPackage: PropTypes.func.isRequired,
    getProvider: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    removeUpdateRequests: PropTypes.func.isRequired,
    unloadResources: PropTypes.func.isRequired,
    updatePackage: PropTypes.func.isRequired,
    updateProvider: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { packageId } = props.match.params;
    const [providerId] = packageId.split('-');
    props.getPackage(packageId);
    props.getProxyTypes();
    props.getProvider(providerId);
    props.getAccessTypes();
  }

  componentDidUpdate(prevProps) {
    const {
      model: next,
      match,
      getPackage,
      unloadResources,
      history,
      location
    } = this.props;
    const {
      model: old,
      match: oldMatch
    } = prevProps;
    const { packageId } = match.params;

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

    const wasPending = prevProps.model.update.isPending && !next.update.isPending;
    const needsUpdate = !isEqual(prevProps.model, next);
    const isRejected = this.props.model.update.isRejected;

    const wasUnSelected = prevProps.model.isSelected && !next.isSelected;
    const isCurrentlySelected = prevProps.model.isSelected && next.isSelected;
    const isFreshlySaved = wasPending && needsUpdate && !isRejected && (wasUnSelected || isCurrentlySelected);

    if (isFreshlySaved || (next.isLoaded && !next.isSelected)) {
      history.replace({
        pathname: `/eholdings/packages/${next.id}`,
        search: this.props.location.search,
        state: { eholdings: true, isFreshlySaved }
      });
    }
  }

  componentWillUnmount() {
    this.props.removeUpdateRequests();
  }

  providerEditSubmitted = (values) => {
    const { provider, updateProvider } = this.props;
    provider.providerToken.value = values.providerTokenValue;
    updateProvider(provider);
  };

  deselectPackage = () => {
    const { model, updatePackage } = this.props;

    // When de-selecting a managed package
    // need to clear out customizations before sending to server
    model.isSelected = false;
    model.visibilityData.isHidden = false;
    model.customCoverage = {};
    model.allowKbToAddTitles = false;
    model.accessTypeId = null;
    updatePackage(model);
  };

  selectPackage = () => {
    const { model, updatePackage } = this.props;

    model.isSelected = true;
    model.allowKbToAddTitles = true;
    model.customCoverage = {};
    updatePackage(model);
  };

  updatePackageValues = (values) => {
    const { model, updatePackage } = this.props;

    let beginCoverage = '';
    let endCoverage = '';

    if (values.customCoverages[0]) {
      beginCoverage = !values.customCoverages[0].beginCoverage ? '' : dayjs.utc(values.customCoverages[0].beginCoverage).format('YYYY-MM-DD');
      endCoverage = !values.customCoverages[0].endCoverage ? '' : dayjs.utc(values.customCoverages[0].endCoverage).format('YYYY-MM-DD');
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

    model.accessTypeId = values.accessTypeId !== accessTypes.ACCESS_TYPE_NONE_ID
      ? values.accessTypeId
      : null;

    updatePackage(model);
  };

  packageEditSubmitted = (values) => {
    const { model, destroyPackage } = this.props;
    // if the package is custom setting the holding status to false
    // or deselecting the package will delete the package from holdings
    if (model.isCustom && values.isSelected === false) {
      destroyPackage(model);
      return;
    }

    if (values.isSelected === false) {
      this.deselectPackage();
      return;
    }

    if (values.isSelected && !values.customCoverages) {
      this.selectPackage();
      return;
    }

    this.updatePackageValues(values);
  };

  /* This method is common between package-show and package-edit routes
   * This should be refactored once we can share model between the routes.
  */
  addPackageToHoldings = () => {
    const { model, updatePackage } = this.props;
    model.isSelected = true;
    model.selectedCount = model.titleCount;
    model.allowKbToAddTitles = true;
    updatePackage(model);
  };

  handleCancel = () => {
    const {
      history,
      model,
      location,
    } = this.props;

    const viewRouteState = {
      pathname: `/eholdings/packages/${model.id}`,
      search: location.search,
      state: {
        eholdings: true,
      },
    };

    history.replace(viewRouteState);
  };

  render() {
    const {
      model,
      proxyTypes,
      provider,
      accessStatusTypes,
    } = this.props;

    return (
      <FormattedMessage id="ui-eholdings.label.editLink" values={{ name: model.name }}>
        {([pageTitle]) => (
          <TitleManager record={pageTitle}>
            <View
              model={model}
              proxyTypes={proxyTypes}
              provider={provider}
              onSubmit={this.packageEditSubmitted}
              onCancel={this.handleCancel}
              addPackageToHoldings={this.addPackageToHoldings}
              accessStatusTypes={accessStatusTypes}
            />
          </TitleManager>
        )}
      </FormattedMessage>
    );
  }
}

export default PackageEditRoute;

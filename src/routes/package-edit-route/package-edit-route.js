import {
  useCallback,
  useEffect,
} from 'react';
import {
  useParams,
  useHistory,
  useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import View from '../../components/package/package-edit';
import {
  usePackageModel,
  useProviderModel,
} from '../../hooks';
import {
  accessTypes,
  accessTypesReduxStateShape,
} from '../../constants';

const propTypes = {
  accessStatusTypes: accessTypesReduxStateShape.isRequired,
  getAccessTypes: PropTypes.func.isRequired,
  getProxyTypes: PropTypes.func.isRequired,
  proxyTypes: PropTypes.object.isRequired,
};

const PackageEditRoute = ({
  accessStatusTypes,
  getAccessTypes,
  getProxyTypes,
  proxyTypes,
}) => {
  const { packageId } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [providerId] = packageId.split('-');

  const handlePackageDeleteSuccess = useCallback(() => {
    if (location.search) {
      history.replace({
        pathname: '/eholdings',
        search: location.search
      }, { eholdings: true });
      // package was reached directly from url not by search
    } else {
      history.replace('/eholdings?searchType=packages', { eholdings: true });
    }
  }, [history, location.search]);

  const handlePackageUpdateSuccess = useCallback(() => {
    history.replace({
      pathname: `/eholdings/packages/${packageId}`,
      search: location.search,
      state: { eholdings: true, isFreshlySaved: true }
    });
  }, [history, location.search, packageId]);

  const { model, deletePackage, updatePackage } = usePackageModel({
    packageId,
    onDeleteSuccess: handlePackageDeleteSuccess,
    onUpdateSuccess: handlePackageUpdateSuccess,
  });
  const { model: provider, updateProvider } = useProviderModel({ providerId });

  useEffect(() => {
    getProxyTypes();
    getAccessTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const providerEditSubmitted = (values) => {
    provider.providerToken.value = values.providerTokenValue;
    updateProvider(provider);
  };

  const deselectPackage = () => {
    const attrs = { ...model };
    // When de-selecting a managed package
    // need to clear out customizations before sending to server
    attrs.isSelected = false;
    attrs.visibility = [];
    attrs.customCoverage = {};
    attrs.allowKbToAddTitles = false;
    attrs.accessTypeId = null;
    updatePackage(attrs);
  };

  const selectPackage = () => {
    const attrs = { ...model };

    attrs.isSelected = true;
    attrs.allowKbToAddTitles = true;
    attrs.customCoverage = {};
    updatePackage(attrs);
  };

  const updatePackageValues = (values) => {
    const attrs = { ...model };

    if ('proxyId' in values) {
      attrs.proxy.id = values.proxyId;
      attrs.proxy.inherited = false;
    }

    if ('packageTokenValue' in values) {
      attrs.packageToken.value = values.packageTokenValue;
    }

    if ('providerTokenValue' in values) {
      providerEditSubmitted(values);
    }

    attrs.customDisplayName = values.customDisplayName || '';
    attrs.customAltNames = values.customAltNames;

    attrs.accessTypeId = values.accessTypeId !== accessTypes.ACCESS_TYPE_NONE_ID
      ? values.accessTypeId
      : null;

    updatePackage(attrs);
  };

  const packageEditSubmitted = (values) => {
    // if the package is custom setting the holding status to false
    // or deselecting the package will delete the package from holdings
    if (model.isCustom && values.isSelected === false) {
      deletePackage(packageId);
      return;
    }

    if (values.isSelected === false) {
      deselectPackage();
      return;
    }

    if (values.isSelected && !values.customCoverages) {
      selectPackage();
      return;
    }

    updatePackageValues(values);
  };

  /* This method is common between package-show and package-edit routes
   * This should be refactored once we can share model between the routes.
  */
  const addPackageToHoldings = () => {
    const attrs = { ...model };
    attrs.isSelected = true;
    attrs.selectedCount = model.titleCount;
    attrs.allowKbToAddTitles = true;
    updatePackage(attrs);
  };

  const handleCancel = () => {
    const viewRouteState = {
      pathname: `/eholdings/packages/${model.id}`,
      search: location.search,
      state: {
        eholdings: true,
      },
    };

    history.replace(viewRouteState);
  };

  return (
    <FormattedMessage id="ui-eholdings.label.editLink" values={{ name: model.name }}>
      {([pageTitle]) => (
        <TitleManager record={pageTitle}>
          <View
            model={model}
            proxyTypes={proxyTypes}
            provider={provider}
            onSubmit={packageEditSubmitted}
            onCancel={handleCancel}
            addPackageToHoldings={addPackageToHoldings}
            accessStatusTypes={accessStatusTypes}
          />
        </TitleManager>
      )}
    </FormattedMessage>
  );
};

PackageEditRoute.propTypes = propTypes;

export default PackageEditRoute;

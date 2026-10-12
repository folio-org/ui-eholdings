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
    const attrs = {
      providerToken: {
        ...provider.providerToken,
        value: values.providerTokenValue,
      },
    };

    updateProvider(attrs);
  };

  const deselectPackage = () => {
    model.deselect();
  };

  const selectPackage = () => {
    model.select();
  };

  const updatePackageValues = (values) => {
    const attrs = {};

    if ('isSelected' in values) {
      attrs.isSelected = values.isSelected;
    }

    attrs.visibility = values.visibility;

    if ('allowKbToAddTitles' in values) {
      attrs.allowKbToAddTitles = values.allowKbToAddTitles;
    }

    if ('name' in values) {
      attrs.name = values.name;
    }

    if ('contentType' in values) {
      attrs.contentType = values.contentType;
    }

    if (values.url?.trim().length) {
      attrs.url = values.url;
    } else {
      delete attrs.url;
    }

    if ('proxyId' in values) {
      attrs.proxy = {
        ...(attrs.proxy),
        id: values.proxyId,
        inherited: false,
      };
    }

    if ('packageTokenValue' in values) {
      attrs.packageToken = {
        ...attrs.packageToken,
        value: values.packageTokenValue,
      };
    }

    if ('providerTokenValue' in values) {
      providerEditSubmitted(values);
    }

    attrs.isCustom = model.isCustom;
    attrs.isFreeAccess = values.isFreeAccess;
    attrs.customAltNames = values.customAltNames;
    attrs.customDisplayName = values.customDisplayName?.trim();
    attrs.customDescription = values.customDescription;

    if (!attrs.customDisplayName?.length) {
      delete attrs.customDisplayName;
    }

    if (!attrs.customDescription?.length) {
      delete attrs.customDescription;
    }

    attrs.customCoverages = values.customCoverages;

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
    model.select();
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

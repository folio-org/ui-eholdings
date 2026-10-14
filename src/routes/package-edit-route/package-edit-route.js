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
import { populatePackageAttributesFromForm } from '../../utils/populate-package-attributes-from-form';

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

  const {
    model,
    deletePackage,
    updatePackage,
    selectPackage,
    deselectPackage,
  } = usePackageModel({
    packageId,
    onDeleteSuccess: handlePackageDeleteSuccess,
    onUpdateSuccess: handlePackageUpdateSuccess,
  });
  const { model: provider, updateProvider } = useProviderModel({ providerId });

  useEffect(() => {
    getProxyTypes();
    getAccessTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateProviderToken = (values) => {
    const attrs = {
      providerToken: {
        ...provider.providerToken,
        value: values.providerTokenValue,
      },
    };

    updateProvider(attrs);
  };

  const updatePackageValues = (values) => {
    const attrs = populatePackageAttributesFromForm(values, model);

    if (values.providerTokenValue !== provider.providerToken?.value) {
      updateProviderToken(values);
    }

    updatePackage(attrs);
  };

  const packageEditSubmitted = (values) => {
    updatePackageValues(values);
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
            addPackageToHoldings={selectPackage}
            deletePackage={deletePackage}
            deselectPackage={deselectPackage}
            accessStatusTypes={accessStatusTypes}
          />
        </TitleManager>
      )}
    </FormattedMessage>
  );
};

PackageEditRoute.propTypes = propTypes;

export default PackageEditRoute;

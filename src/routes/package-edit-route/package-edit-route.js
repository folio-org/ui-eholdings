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
import { dayjs } from '@folio/stripes/components';

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
        ...(model.proxy),
        id: values.proxyId,
        inherited: false,
      };
    }

    if (values.packageTokenValue !== model.packageTokenValue) {
      attrs.packageToken = {
        ...model.packageToken,
        value: values.packageTokenValue,
      };
    }

    if (values.providerTokenValue !== provider.providerToken?.value) {
      updateProviderToken(values);
    }

    attrs.isCustom = model.isCustom;
    attrs.isFreeAccess = values.isFreeAccess;

    // only send altName property of form fields, and filter out any empty fields, if present
    attrs.customAltNames = values.customAltNames
      ?.map(altNameObj => ({
        altName: altNameObj.altName,
      }))
      .filter(({ altName }) => altName?.trim().length);

    // customDisplayName must not be empty
    if (values.customDisplayName?.trim().length) {
      attrs.customDisplayName = values.customDisplayName;
    }

    // customDescription must not be empty
    if (values.customDescription?.trim().length) {
      attrs.customDescription = values.customDescription;
    }

    if (values?.customCoverages?.[0]) {
      attrs.customCoverage = {
        beginCoverage: !values.customCoverages[0].beginCoverage ? '' :
          dayjs.utc(values.customCoverages[0].beginCoverage).format('YYYY-MM-DD'),
        endCoverage: !values.customCoverages[0].endCoverage ? '' :
          dayjs.utc(values.customCoverages[0].endCoverage).format('YYYY-MM-DD')
      };
    }

    attrs.accessTypeId = values.accessTypeId !== accessTypes.ACCESS_TYPE_NONE_ID
      ? values.accessTypeId
      : null;

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

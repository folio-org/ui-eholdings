import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router';

import { TitleManager } from '@folio/stripes/core';
import { dayjs } from '@folio/stripes/components';

import { PackageCreate } from '../../components/package/create';
import { usePackageCreate } from '../../hooks';
import { accessTypesReduxStateShape } from '../../constants';
import { populatePackageAttributesFromForm } from '../../utils/populate-package-attributes-from-form';

const propTypes = {
  accessStatusTypes: accessTypesReduxStateShape.isRequired,
  getAccessTypes: PropTypes.func.isRequired,
};

const PackageCreateRoute = ({
  accessStatusTypes,
  getAccessTypes,
}) => {
  const history = useHistory();
  const location = useLocation();

  const handleCreateSuccess = (res) => {
    history.replace(
      `/eholdings/packages/${res.data.id}`,
      { eholdings: true, isNewRecord: true }
    );
  };

  const {
    createPackage,
    isLoading: isPackageCreateLoading,
    errors: packageCreateErrors,
  } = usePackageCreate({
    onSuccess: handleCreateSuccess,
  });

  const handleSubmit = (values) => {
    const attrs = populatePackageAttributesFromForm(values);

    createPackage(attrs);
  };

  useEffect(() => {
    getAccessTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FormattedMessage id="ui-eholdings.label.create.package">
      {([pageTitle]) => (
        <TitleManager record={pageTitle}>
          <PackageCreate
            onSubmit={handleSubmit}
            onCancel={location.state?.eholdings ? () => history.goBack() : null}
            accessStatusTypes={accessStatusTypes}
            isPackageCreateLoading={isPackageCreateLoading}
            packageCreateErrors={packageCreateErrors}
          />
        </TitleManager>
      )}
    </FormattedMessage>
  );
};

PackageCreateRoute.propTypes = propTypes;

export default PackageCreateRoute;

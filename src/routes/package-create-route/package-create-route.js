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
    const attrs = {};

    if (values?.customCoverages?.[0]) {
      attrs.customCoverage = {
        beginCoverage: !values.customCoverages[0].beginCoverage ? '' :
          dayjs.utc(values.customCoverages[0].beginCoverage).format('YYYY-MM-DD'),
        endCoverage: !values.customCoverages[0].endCoverage ? '' :
          dayjs.utc(values.customCoverages[0].endCoverage).format('YYYY-MM-DD')
      };
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

    // customDisplayName must not be empty
    if (values.customDisplayName?.trim().length) {
      attrs.customDisplayName = values.customDisplayName;
    }

    // customDescription must not be empty
    if (values.customDescription?.trim().length) {
      attrs.customDescription = values.customDescription;
    }

    attrs.isFreeAccess = values.isFreeAccess;
    attrs.accessTypeId = values.accessTypeId;

    // only send altName property of form field s, and filter out any empty fields, if present
    attrs.customAltNames = values.customAltNames
      ?.map(altNameObj => ({
        altName: altNameObj.altName,
      }))
      .filter(({ altName }) => altName?.trim().length);

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

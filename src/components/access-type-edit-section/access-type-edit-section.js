import React from 'react';

import { Icon } from '@folio/stripes/components';

import AccessTypeField from '../access-type-select';
import {
  getAccessTypeIdsAndNames,
} from '../utilities';

import { accessTypesReduxStateShape } from '../../constants';

const propTypes = {
  accessStatusTypes: accessTypesReduxStateShape.isRequired,
};

const AccessStatusTypeEditSection = ({ accessStatusTypes }) => {
  if (!accessStatusTypes?.items?.data?.length) {
    return null;
  }

  const formattedAccessTypes = getAccessTypeIdsAndNames(accessStatusTypes.items.data);

  return accessStatusTypes.isLoading
    ? <Icon icon="spinner-ellipsis" />
    : (
      <div data-test-eholdings-access-types-select>
        <AccessTypeField accessStatusTypes={formattedAccessTypes} />
      </div>
    );
};

AccessStatusTypeEditSection.propTypes = propTypes;

export default AccessStatusTypeEditSection;

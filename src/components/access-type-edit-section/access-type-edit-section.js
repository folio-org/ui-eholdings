import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes/components';

import AccessTypeField from '../access-type-select';
import {
  getAccessTypeIdsAndNames,
} from '../utilities';

const propTypes = {
  accessStatusTypes: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.shape({
      data: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
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

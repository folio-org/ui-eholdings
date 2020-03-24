import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { accessTypes } from '../../constants';

const propTypes = {
  accessStatusTypes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
};

function AccessTypeSelectField({ accessStatusTypes }) {
  const accessTypesWithNoneOption = [{ id: accessTypes.ACCESS_TYPE_NONE_ID }, ...accessStatusTypes];

  const checkIfNoneOption = accessTypeId => accessTypeId === accessTypes.ACCESS_TYPE_NONE_ID;

  const options = accessTypesWithNoneOption
    .map(accessType => (
      <FormattedMessage
        key={accessType.id}
        id="ui-eholdings.accessType.select"
      >
        {(message) => (
          <option value={accessType.id}>
            {checkIfNoneOption(accessType.id) ? message : `${accessType.name}`}
          </option>
        )}
      </FormattedMessage>
    ));

  return (
    <div data-test-eholdings-access-type-select-field>
      <Field
        id="eholdings-access-type-id"
        name="accessTypeId"
        component={Select}
        label={<FormattedMessage id="ui-eholdings.settings.accessStatusTypes.type" />}
      >
        {options}
      </Field>
    </div>
  );
}

AccessTypeSelectField.propTypes = propTypes;

export default AccessTypeSelectField;

import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { accessTypes } from '../../constants';

const propTypes = {
  accessStatusTypes: PropTypes.object.isRequired,
};

function AccessTypeSelectField({ accessStatusTypes }) {
  const accessTypesRecords = accessStatusTypes.resolver.state.accessTypes.records;

  const accessTypesWithNoneOption = [{ id: accessTypes.ACCESS_TYPE_NONE_ID }, ...Object.values(accessTypesRecords)];

  const checkIfNoneOption = accessTypeId => accessTypeId === accessTypes.ACCESS_TYPE_NONE_ID;

  const options = accessTypesWithNoneOption
    .map(accessType => (
      <FormattedMessage
        key={accessType.id}
        id="ui-eholdings.accessType.select"
      >
        {(message) => (
          <option value={accessType.id}>
            {checkIfNoneOption(accessType.id) ? message : `${accessType.attributes.name}`}
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
        label={<FormattedMessage id="ui-eholdings.accessType" />}
      >
        {options}
      </Field>
    </div>
  );
}

AccessTypeSelectField.propTypes = propTypes;

export default AccessTypeSelectField;

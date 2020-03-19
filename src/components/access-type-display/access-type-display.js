import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { KeyValue, NoValue } from '@folio/stripes/components';

import { getAccessTypeId } from '../utilities';

const propTypes = {
  accessStatusTypes: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
};

function AccessTypeDisplay({ model, accessStatusTypes }) {
  const accessTypesRecords = accessStatusTypes.resolver.state.accessTypes.records;
  const hasAccessTypes = !!Object.keys(accessTypesRecords).length;
  const accessTypeId = getAccessTypeId(model);

  if (!hasAccessTypes) {
    return null;
  }

  const selectedAccessType = accessTypesRecords[accessTypeId]?.attributes?.name || '';

  return (
    <KeyValue label={<FormattedMessage id="ui-eholdings.accessType" />}>
      <div data-test-eholdings-details-access-type>
        {accessTypeId
          ? selectedAccessType
          : (
            <FormattedMessage id="ui-eholdings.accessType.novalue">
              {message => <NoValue ariaLabel={message} />}
            </FormattedMessage>
          )}
      </div>
    </KeyValue>
  );
}

AccessTypeDisplay.propTypes = propTypes;

export default AccessTypeDisplay;

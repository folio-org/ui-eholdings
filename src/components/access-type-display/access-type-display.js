import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { KeyValue, NoValue } from '@folio/stripes/components';

const propTypes = {
  accessStatusTypes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  accessTypeId: PropTypes.string.isRequired,
};

function AccessTypeDisplay({ accessTypeId, accessStatusTypes }) {
  const selectedAccessType = accessStatusTypes
    .find(accessType => accessType.id === accessTypeId)?.name || '';

  return (
    <KeyValue label={<FormattedMessage id="ui-eholdings.settings.accessStatusTypes.type" />}>
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

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const propTypes = {
  entityType: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
};

const NoCostPerUseAvailable = ({
  entityType,
  year,
}) => (
  <div data-test-usage-consolidation-error>
    <FormattedMessage
      id={`ui-eholdings.usageConsolidation.summary.${entityType}.noData`}
      values={{ year }}
    />
  </div>
);

NoCostPerUseAvailable.propTypes = propTypes;

export default NoCostPerUseAvailable;

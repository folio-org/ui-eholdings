import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { InfoPopover } from '@folio/stripes/components';

const propTypes = {
  entityType: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  metricType: PropTypes.string,
};

const UsageColumnHeader = ({ label, metricType, entityType }) => ((
  <>
    {label}
    { /* eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events */ }
    <span
      role="button"
      onClick={(e) => {
        // We don't need to open / close the accordion by clicking on the info icon
        e.stopPropagation();
      }}
    >
      <InfoPopover
        data-test-usage-consolidation-data-metric-info-popover
        allowAnchorClick
        hideOnButtonClick
        iconSize="medium"
        content={(
          <FormattedMessage
            id={`ui-eholdings.usageConsolidation.summary.totalUsage.infoPopover.${entityType}`}
            values={{ metricType }}
          />
        )}
        buttonLabel={<FormattedMessage id="ui-eholdings.usageConsolidation.infoPopover.buttonLabel" />}
      />
    </span>
  </>
));

UsageColumnHeader.propTypes = propTypes;

export default UsageColumnHeader;

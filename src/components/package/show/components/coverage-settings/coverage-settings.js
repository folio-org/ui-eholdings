import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Accordion,
  Headline,
  KeyValue,
  FormattedDate,
} from '@folio/stripes/components';

const propTypes = {
  customCoverage: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  packageSelected: PropTypes.bool.isRequired,
};

const CoverageSettings = ({
  isOpen,
  onToggle,
  packageSelected,
  customCoverage,
}) => {
  if (!packageSelected) {
    return <p><FormattedMessage id="ui-eholdings.package.customCoverage.notSelected" /></p>;
  }

  if (!customCoverage.beginCoverage) {
    return <p><FormattedMessage id="ui-eholdings.package.customCoverage.notSet" /></p>;
  }

  return (
    <Accordion
      label={(
        <Headline
          size="large"
          tag="h3"
        >
          <FormattedMessage id="ui-eholdings.package.coverageSettings" />
        </Headline>
      )}
      closedByDefault={!packageSelected}
      open={isOpen}
      id="packageShowCoverageSettings"
      onToggle={onToggle}
    >
      <KeyValue label={<FormattedMessage id="ui-eholdings.package.customCoverageDates" />}>
        <div data-test-eholdings-package-details-custom-coverage-display>
          <FormattedDate
            value={customCoverage.beginCoverage}
            timeZone="UTC"
            year="numeric"
            month="numeric"
            day="numeric"
          />
          &nbsp;-&nbsp;
          {
            customCoverage.endCoverage
              ? (
                <FormattedDate
                  value={customCoverage.endCoverage}
                  timeZone="UTC"
                  year="numeric"
                  month="numeric"
                  day="numeric"
                />
              )
              : <FormattedMessage id="ui-eholdings.date.present" />
          }
        </div>
      </KeyValue>
    </Accordion>
  );
};

CoverageSettings.propTypes = propTypes;

export default CoverageSettings;

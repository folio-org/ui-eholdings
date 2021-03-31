import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Accordion,
  Headline,
  KeyValue,
} from '@folio/stripes/components';

import CoverageDateList from '../../../coverage-date-list';

import {
  isBookPublicationType,
  isValidCoverageList,
} from '../../../utilities';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  resourceSelected: PropTypes.bool.isRequired,
};

const CoverageSettings = ({
  isOpen,
  onToggle,
  model,
  resourceSelected,
}) => {
  const hasManagedCoverages = model.managedCoverages.length > 0 &&
    isValidCoverageList(model.managedCoverages);
  const hasManagedEmbargoPeriod = model.managedEmbargoPeriod &&
    model.managedEmbargoPeriod.embargoUnit &&
    model.managedEmbargoPeriod.embargoValue;
  const hasCustomEmbargoPeriod = model.customEmbargoPeriod &&
    model.customEmbargoPeriod.embargoUnit &&
    model.customEmbargoPeriod.embargoValue;
  const hasCustomCoverages = model.customCoverages.length > 0 &&
    isValidCoverageList(model.customCoverages);

  const showNoCustomizationsMessage = resourceSelected &&
    !hasManagedCoverages &&
    !hasCustomCoverages &&
    !model.coverageStatement &&
    !hasManagedEmbargoPeriod &&
    !hasCustomEmbargoPeriod;

  const showNotSelectedMessage = !resourceSelected && !hasManagedCoverages && !hasManagedEmbargoPeriod;

  return (
    <Accordion
      label={(
        <Headline size="large" tag="h3">
          <FormattedMessage id="ui-eholdings.label.coverageSettings" />
        </Headline>
      )}
      open={isOpen}
      id="resourceShowCoverageSettings"
      onToggle={onToggle}
    >

      {hasManagedCoverages && !hasCustomCoverages && (
        <KeyValue label={<FormattedMessage id="ui-eholdings.label.managed.coverageDates" />}>
          <div data-test-eholdings-resource-show-managed-coverage-list>
            <CoverageDateList
              isManagedCoverage
              coverageArray={model.managedCoverages}
              isYearOnly={isBookPublicationType(model.publicationType)}
            />
          </div>
        </KeyValue>
      )}

      {hasCustomCoverages && (
        <KeyValue label={<FormattedMessage id="ui-eholdings.label.custom.coverageDates" />}>
          <div data-test-eholdings-resource-show-custom-coverage-list>
            <CoverageDateList
              coverageArray={model.customCoverages}
              isYearOnly={isBookPublicationType(model.publicationType)}
            />
          </div>
        </KeyValue>
      )}

      {model.coverageStatement && (
        <KeyValue label={<FormattedMessage id="ui-eholdings.label.custom.coverageStatement" />}>
          <div data-test-eholdings-resource-coverage-statement-display>
            {model.coverageStatement}
          </div>
        </KeyValue>
      )}

      {hasManagedEmbargoPeriod && !hasCustomEmbargoPeriod && (
        <KeyValue label={<FormattedMessage id="ui-eholdings.label.managed.embargoPeriod" />}>
          <div data-test-eholdings-resource-show-managed-embargo-period>
            <FormattedMessage
              id={`ui-eholdings.resource.embargoUnit.${model.managedEmbargoPeriod.embargoUnit}`}
              values={{ value: model.managedEmbargoPeriod.embargoValue }}
            />
          </div>
        </KeyValue>
      )}

      {hasCustomEmbargoPeriod && (
        <KeyValue label={<FormattedMessage id="ui-eholdings.label.custom.embargoPeriod" />}>
          <div data-test-eholdings-resource-custom-embargo-display>
            <FormattedMessage
              id={`ui-eholdings.resource.embargoUnit.${model.customEmbargoPeriod.embargoUnit}`}
              values={{ value: model.customEmbargoPeriod.embargoValue }}
            />
          </div>
        </KeyValue>
      )}

      {
        showNoCustomizationsMessage && (
          <p data-test-eholdings-resource-not-selected-no-customization-message>
            <FormattedMessage id="ui-eholdings.resource.coverage.noCustomizations" />
          </p>
        )
      }

      {showNotSelectedMessage && (
        <p data-test-eholdings-resource-not-selected-coverage-message>
          <FormattedMessage id="ui-eholdings.resource.coverage.notSelected" />
        </p>
      )}
    </Accordion>
  );
};

CoverageSettings.propTypes = propTypes;

export default CoverageSettings;

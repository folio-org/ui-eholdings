import {
  FormattedMessage,
} from 'react-intl';
import PropTypes from 'prop-types';
import { FormSpy } from 'react-final-form';

import {
  Accordion,
  Headline,
} from '@folio/stripes/components';

import CoverageDateList from '../../../../coverage-date-list';
import CoverageStatementFields from '../../../_fields/coverage-statement';
import CustomEmbargoFields from '../../../_fields/custom-embargo';
import CoverageFields from '../../../_fields/resource-coverage-fields';

import { isBookPublicationType } from '../../../../utilities';

const propTypes = {
  getSectionHeader: PropTypes.func.isRequired,
  handleSectionToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  resourceSelected: PropTypes.bool.isRequired,
};

const EditCoverageSettings = ({
  isOpen,
  getSectionHeader,
  handleSectionToggle,
  resourceSelected,
  model,
}) => {
  const renderCoverageDates = () => {
    return (
      <FormSpy subscription={{ values: true }}>
        {({ values }) => {
          const { customCoverages: customCoverageDateValues } = values;
          let coverageDates = model.managedCoverages;

          const customCoverageExists = customCoverageDateValues && customCoverageDateValues.length > 0;

          if (customCoverageExists) {
            coverageDates = customCoverageDateValues;
          }

          const nonEmptyCoverageDates = coverageDates
            .filter((currentCoverageDate) => Object.keys(currentCoverageDate).length !== 0);

          if (nonEmptyCoverageDates.length === 0) {
            return null;
          }
          return (
            <CoverageDateList
              isManagedCoverage={customCoverageExists}
              coverageArray={nonEmptyCoverageDates}
              isYearOnly={isBookPublicationType(model.publicationType)}
            />
          );
        }}
      </FormSpy>
    );
  };

  return (
    <Accordion
      label={getSectionHeader('ui-eholdings.label.coverageSettings')}
      open={isOpen}
      id="resourceShowCoverageSettings"
      onToggle={handleSectionToggle}
    >
      {resourceSelected ? (
        <>
          <Headline tag="h4">
            <FormattedMessage id="ui-eholdings.label.dates" />
          </Headline>
          <CoverageFields model={model} />

          <Headline tag="h4" id="coverage-display-label">
            <FormattedMessage id="ui-eholdings.label.coverageDisplay" />
          </Headline>
          <CoverageStatementFields
            coverageDates={renderCoverageDates()}
            ariaLabelledBy="coverage-display-label"
          />

          <Headline tag="h4" id="embargo-period-label">
            <FormattedMessage id="ui-eholdings.resource.embargoPeriod" />
          </Headline>
          <CustomEmbargoFields
            ariaLabelledBy="embargo-period-label"
          />
        </>
      ) : (
        <p data-test-eholdings-resource-edit-settings-message>
          <FormattedMessage id="ui-eholdings.resource.coverage.notSelected" />
        </p>
      )}
    </Accordion>
  );
};

EditCoverageSettings.propTypes = propTypes;

export default EditCoverageSettings;

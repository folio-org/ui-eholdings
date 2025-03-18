import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Accordion,
} from '@folio/stripes/components';

import CoverageFields from '../../../_fields/custom-coverage';

const propTypes = {
  getSectionHeader: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  packageIsCustom: PropTypes.bool,
  packageSelected: PropTypes.bool.isRequired,
};

const EditCoverageSettings = ({
  isOpen,
  getSectionHeader,
  onToggle,
  packageSelected,
  initialValues,
  packageIsCustom = false,
}) => {
  return (
    <Accordion
      label={getSectionHeader('ui-eholdings.package.coverageSettings')}
      open={isOpen}
      id="packageCoverageSettings"
      onToggle={onToggle}
    >
      {(!packageIsCustom || packageSelected) ? (
        <CoverageFields
          initial={initialValues.customCoverages}
        />
      ) : (
        <p><FormattedMessage id="ui-eholdings.package.customCoverage.notSelected" /></p>
      )}
    </Accordion>
  );
};

EditCoverageSettings.propTypes = propTypes;

export default EditCoverageSettings;

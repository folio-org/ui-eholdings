import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import { RadioButton, TextArea } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import styles from './coverage-statement-fields.css';

import { COVERAGE_STATEMENT_VALUE_MAX_LENGTH } from '../../../../constants';

const validate = (value, { hasCoverageStatement }) => {
  let error;

  if (value?.length > COVERAGE_STATEMENT_VALUE_MAX_LENGTH) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.coverageStatement.length" />;
  }

  if (hasCoverageStatement === 'yes' && !value) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.coverageStatement.blank" />;
  }

  return error;
};

const propTypes = {
  ariaLabelledBy: PropTypes.string.isRequired,
  coverageDates: PropTypes.node,
};

const CoverageStatementFields = ({
  coverageDates,
  ariaLabelledBy,
}) => {
  return (
    <fieldset>
      <div
        data-test-eholdings-has-coverage-statement
        data-testid="coverage-statement"
      >
        <Field
          name="hasCoverageStatement"
          component={RadioButton}
          type="radio"
          label={<FormattedMessage id="ui-eholdings.label.dates" />}
          value="no"
        />
        <div className={styles['coverage-statement-fields-category']}>
          {coverageDates}
        </div>
        <Field
          name="hasCoverageStatement"
          component={RadioButton}
          type="radio"
          label={<FormattedMessage id="ui-eholdings.label.coverageStatement" />}
          value="yes"
        />
      </div>
      <div
        data-test-eholdings-coverage-statement-textarea
        className={styles['coverage-statement-fields-category']}
      >
        <Field
          name="coverageStatement"
          component={TextArea}
          validate={validate}
          aria-labelledby={ariaLabelledBy}
          data-testid="coverage-statement-textarea"
        />
      </div>
    </fieldset>
  );
};

CoverageStatementFields.propTypes = propTypes;

export default CoverageStatementFields;

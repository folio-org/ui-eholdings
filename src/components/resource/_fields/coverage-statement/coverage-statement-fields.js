import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import { RadioButton, TextArea } from '@folio/stripes-components';
import { injectIntl, intlShape } from 'react-intl';
import styles from './coverage-statement-fields.css';

class CoverageStatementFields extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    coverageDates: PropTypes.node,
    intl: intlShape.isRequired
  };

  render() {
    let { change, coverageDates, intl } = this.props;

    return (
      <fieldset>
        <Field
          name="hasCoverageStatement"
          component={RadioButton}
          type="radio"
          label={intl.formatMessage({ id:'ui-eholdings.label.dates' })}
          value="no"
          onChange={() => {
            change('coverageStatement', '');
          }}
        />
        <div className={styles['coverage-statement-fields-category']}>
          {coverageDates}
        </div>
        <Field
          name="hasCoverageStatement"
          component={RadioButton}
          type="radio"
          label={intl.formatMessage({ id:'ui-eholdings.label.coverageStatement' })}
          value="yes"
        />
        <div data-test-eholdings-coverage-statement-textarea className={styles['coverage-statement-fields-category']}>
          <Field
            name="coverageStatement"
            component={TextArea}
            onChange={(e, newValue) => {
              change('hasCoverageStatement', (newValue.length > 0) ? 'yes' : 'no');
            }}
          />
        </div>
      </fieldset>
    );
  }
}

export default injectIntl(CoverageStatementFields);

export function validate(values, { intl }) {
  const errors = {};

  if (values.coverageStatement && values.coverageStatement.length > 350) {
    errors.coverageStatement = intl.formatMessage({
      id: 'ui-eholdings.validate.errors.coverageStatement.length'
    });
  }

  if (values.hasCoverageStatement === 'yes' && values.coverageStatement.length === 0) {
    errors.coverageStatement = intl.formatMessage({
      id: 'validate.errors.coverageStatement.blank'
    });
  }

  return errors;
}

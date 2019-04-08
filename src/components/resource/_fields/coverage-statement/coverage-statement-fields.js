import React, { Component } from 'react';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import { RadioButton, TextArea } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import styles from './coverage-statement-fields.css';

function validate(value, { hasCoverageStatement }) {
  let error;

  if (value && value.length > 350) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.coverageStatement.length" />;
  }

  if (hasCoverageStatement === 'yes' && !value) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.coverageStatement.blank" />;
  }

  return error;
}

export default class CoverageStatementFields extends Component {
  static propTypes = {
    coverageDates: PropTypes.node
  };

  render() {
    const { coverageDates } = this.props;

    return (
      <fieldset>
        <div data-test-eholdings-has-coverage-statement>
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
        <div data-test-eholdings-coverage-statement-textarea className={styles['coverage-statement-fields-category']}>
          <Field
            name="coverageStatement"
            component={TextArea}
            validate={validate}
          />
        </div>
      </fieldset>
    );
  }
}

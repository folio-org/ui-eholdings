import React, { Component } from 'react';
import { Field } from 'redux-form';

import { TextArea } from '@folio/stripes-components';

export default class CoverageStatementFields extends Component {
  render() {
    return (
      <div data-test-eholdings-coverage-statement-textarea>
        <Field
          name="coverageStatement"
          component={TextArea}
          label="Describes the coverage to patrons."
        />
      </div>
    );
  }
}

export function validate(values) {
  const errors = {};

  if (values.coverageStatement && values.coverageStatement.length > 350) {
    errors.coverageStatement = 'Statement must be 350 characters or less.';
  }

  return errors;
}

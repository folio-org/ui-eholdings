import React, { Component } from 'react';
import { Field } from 'redux-form';

import { TextArea } from '@folio/stripes-components';
import { injectIntl, intlShape } from 'react-intl';

class CoverageStatementFields extends Component {
  static propTypes = {
    intl: intlShape.isRequired
  };

  render() {
    let { intl } = this.props;
    return (
      <div data-test-eholdings-coverage-statement-textarea>
        <Field
          name="coverageStatement"
          component={TextArea}
          label={intl.formatMessage({ id:'ui-eholdings.resource.coverageStatement.textArea' })}
        />
      </div>
    );
  }
}

export default injectIntl(CoverageStatementFields);

export function validate(values, intl) {
  const errors = {};

  if (values.coverageStatement && values.coverageStatement.length > 350) {
    errors.coverageStatement = intl.formatMessage({
      id: 'ui-eholdings.validate.errors.coverageStatement.length'
    });
  }

  return errors;
}

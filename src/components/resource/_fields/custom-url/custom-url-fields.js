import React, { Component } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { TextField } from '@folio/stripes/components';

function validate(value) {
  let errors;

  if (value && value.length > 600) {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.customUrl.length" />;
  }

  if (value && value.search(/http?[s]?:\/\//g)) {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.customUrl.include" />;
  }

  return errors;
}

export default class CustomUrlFields extends Component {
  render() {
    return (
      <div>
        <div data-test-eholdings-custom-url-textfield>
          <Field
            name="customUrl"
            component={TextField}
            label={<FormattedMessage id="ui-eholdings.customUrl" />}
            validate={validate}
          />
        </div>
      </div>
    );
  }
}

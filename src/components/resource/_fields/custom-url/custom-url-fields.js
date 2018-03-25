import React, { Component } from 'react';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes-components';

class CustomUrlFields extends Component {
  render() {
    return (
      <div>
        <div data-test-eholdings-custom-url-textfield>
          <Field
            name="customUrl"
            component={TextField}
            label="Custom URL"
          />
        </div>
      </div>
    );
  }
}

export function validate(values) {
  const errors = {};

  if (values.customUrl && values.customUrl.length > 600) {
    errors.customUrl = 'Custom URLs must be 600 characters or less.';
  }

  if (values.customUrl && values.customUrl.search(/http?[s]?:\/\//g)) {
    errors.customUrl = 'The URL should include http:// or https://';
  }

  return errors;
}

export default CustomUrlFields;

import React, { Component } from 'react';
import { Field } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';

import { TextField } from '@folio/stripes-components';

class CustomUrlFields extends Component {
  render() {
    return (
      <div>
        <div data-test-eholdings-custom-url-textfield>
          <Field
            name="customUrl"
            component={TextField}
            label={<FormattedMessage id="ui-eHoldings.customUrl" />}
          />
        </div>
      </div>
    );
  }
}

export function validate(values, intl) {
  const errors = {};

  if (values.customUrl && values.customUrl.length > 600) {
    errors.customUrl = intl.formatMessage({ id: 'ui-eholdings.validate.errors.customUrl.length' });
  }

  if (values.customUrl && values.customUrl.search(/http?[s]?:\/\//g)) {
    errors.customUrl = intl.formatMessage({ id: 'ui-eholdings.validate.errors.customUrl.include' });
  }

  return errors;
}

export default injectIntl(CustomUrlFields);

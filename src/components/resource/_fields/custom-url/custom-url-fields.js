import React, { Component } from 'react';
import { Field } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';
import { TextField } from '@folio/stripes/components';

class CustomUrlFields extends Component {
  static propTypes = {
    intl: intlShape.isRequired
  };

  render() {
    let { intl } = this.props;
    return (
      <div>
        <div data-test-eholdings-custom-url-textfield>
          <Field
            name="customUrl"
            component={TextField}
            label={intl.formatMessage({ id: 'ui-eholdings.customUrl' })}
          />
        </div>
      </div>
    );
  }
}

export function validate(values, props) {
  const errors = {};

  if (values.customUrl && values.customUrl.length > 600) {
    errors.customUrl = props.intl.formatMessage({ id: 'ui-eholdings.validate.errors.customUrl.length' });
  }

  if (values.customUrl && values.customUrl.search(/http?[s]?:\/\//g)) {
    errors.customUrl = props.intl.formatMessage({ id: 'ui-eholdings.validate.errors.customUrl.include' });
  }

  return errors;
}

export default injectIntl(CustomUrlFields);

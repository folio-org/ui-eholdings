import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

const CustomUrlFields = (props) => {
  const validate = (value) => {
    let errors;

    if (value && value.length > 600) {
      errors = <FormattedMessage id="ui-eholdings.validate.errors.customUrl.length" />;
    }

    if (value && value.search(/http?[s]?:\/\//g)) {
      errors = <FormattedMessage id="ui-eholdings.validate.errors.customUrl.include" />;
    }

    return errors;
  };

  return (
    <div data-test-eholdings-custom-url-textfield>
      <Field
        name="customUrl"
        component={TextField}
        label={<FormattedMessage id="ui-eholdings.customUrl" />}
        validate={validate}
        data-testid="custom-url-field"
        {...props}
      />
    </div>
  );
};

export default CustomUrlFields;

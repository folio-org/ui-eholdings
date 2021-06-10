import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { TextField } from '@folio/stripes/components';

const CustomUrlFields = (props) => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'ui-eholdings.customUrl' });

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
        label={label}
        ariaLabel={label}
        validate={validate}
        data-testid="custom-url-field"
        {...props}
      />
    </div>
  );
};

export default CustomUrlFields;

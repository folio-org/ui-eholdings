import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { TextField } from '@folio/stripes/components';

function validate(value) {
  let errors;

  if (!value) {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.customTitle.name" />;
  }

  if (value && value.length >= 400) {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.customTitle.name.length" />;
  }

  return errors;
}

const TitleNameField = () => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'ui-eholdings.label.name' });

  return (
    <div data-test-eholdings-title-name-field>
      <Field
        name="name"
        type="text"
        component={TextField}
        label={label}
        validate={validate}
        ariaLabel={label}
        required
        data-testid="title-name-field"
      />
    </div>
  );
};

export default TitleNameField;

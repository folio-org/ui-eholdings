import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { TextField } from '@folio/stripes/components';

const MAX_CHARACTER_LENGTH = 250;

function validate(value) {
  let errors;

  if (value && value.trim() === '') {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.edition.value" />;
  }

  if (value && value.length > MAX_CHARACTER_LENGTH) {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.edition.length" />;
  }

  return errors;
}

const EditionField = () => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'ui-eholdings.title.edition' });

  return (
    <div data-test-eholdings-edition-field>
      <Field
        name="edition"
        component={TextField}
        label={label}
        validate={validate}
        ariaLabel={label}
        data-testid="edition-field"
      />
    </div>
  );
};

export default EditionField;

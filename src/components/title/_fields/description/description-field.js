import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { TextArea } from '@folio/stripes/components';

const MAX_CHARACTER_LENGTH = 400;

function validate(value) {
  return value && value.length > MAX_CHARACTER_LENGTH ?
    <FormattedMessage
      id="ui-eholdings.validate.errors.title.description.length"
      values={{ amount: MAX_CHARACTER_LENGTH }}
    /> : undefined;
}

const DescriptionField = () => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'ui-eholdings.title.description' });

  return (
    <div data-test-eholdings-description-textarea>
      <Field
        name="description"
        component={TextArea}
        label={label}
        validate={validate}
        aria-label={label}
        data-testid="description-field"
      />
    </div>
  );
};

export default DescriptionField;

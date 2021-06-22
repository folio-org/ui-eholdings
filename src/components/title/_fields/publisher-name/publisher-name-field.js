import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes/components';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

const MAX_CHARACTER_LENGTH = 250;

function validate(value) {
  return value && value.length > MAX_CHARACTER_LENGTH
    ? <FormattedMessage id="ui-eholdings.validate.errors.publisherName.length" />
    : undefined;
}

const PublisherNameField = () => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'ui-eholdings.title.publisherName' });

  return (
    <div data-test-eholdings-publisher-name-field>
      <Field
        name="publisherName"
        component={TextField}
        label={label}
        validate={validate}
        ariaLabel={label}
        data-testid="publisher-name-field"
      />
    </div>
  );
};

export default PublisherNameField;

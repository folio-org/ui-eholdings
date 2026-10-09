import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { TextArea } from '@folio/stripes/components';

const MAX_CHARACTER_LENGTH = 500;

const validate = (value) => {
  let errors;

  if (value?.length > MAX_CHARACTER_LENGTH) {
    errors = (
      <FormattedMessage
        id="ui-eholdings.validate.errors.customPackage.packageUrl.length"
        values={{ amount: MAX_CHARACTER_LENGTH }}
      />
    );
  }

  return errors;
};

export const PackageUrl = () => {
  const intl = useIntl();

  const labelText = intl.formatMessage({ id: 'ui-eholdings.label.packageUrl' });

  return (
    <Field
      name="url"
      type="text"
      component={TextArea}
      label={labelText}
      rows={1}
      validate={validate}
      ariaLabel={labelText}
    />
  );
};

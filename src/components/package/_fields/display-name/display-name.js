import { useMemo } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { TextArea } from '@folio/stripes/components';

const MAX_CHARACTER_LENGTH = 300;

const validate = (value) => {
  let errors;

  if (value?.length > MAX_CHARACTER_LENGTH) {
    errors = (
      <FormattedMessage
        id="ui-eholdings.validate.errors.customPackage.displayName.length"
        values={{ amount: MAX_CHARACTER_LENGTH }}
      />
    );
  }

  return errors;
};

export const DisplayName = () => {
  const intl = useIntl();

  const labelText = intl.formatMessage({ id: 'ui-eholdings.label.displayName' });

  // later label will contain a Popover component
  const label = useMemo(() => (
    <>
      {labelText}
    </>
  ), [labelText]);

  return (
    <Field
      name="customDisplayName"
      type="text"
      component={TextArea}
      label={label}
      validate={validate}
      ariaLabel={labelText}
    />
  );
};

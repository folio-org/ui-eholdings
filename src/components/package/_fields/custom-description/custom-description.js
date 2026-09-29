import { useMemo } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  InfoPopover,
  Editor,
} from '@folio/stripes/components';

const MAX_CHARACTER_LENGTH = 2000;

const validate = (value) => {
  if (value?.length > MAX_CHARACTER_LENGTH) {
    return (
      <FormattedMessage
        id="ui-eholdings.validate.errors.customPackage.customDescription.length"
        values={{ amount: MAX_CHARACTER_LENGTH }}
      />
    );
  }

  return null;
};

const CustomDescription = () => {
  const intl = useIntl();

  const labelText = intl.formatMessage({ id: 'ui-eholdings.label.customDescription' });

  const label = useMemo(() => (
    <>
      {labelText}
      <InfoPopover
        iconSize="small"
        content={intl.formatMessage({ id: 'ui-eholdings.label.customDescription.infoPopover' })}
      />
    </>
  ), [labelText, intl]);

  return (
    <Field
      id="customDescription"
      name="customDescription"
      type="text"
      component={Editor}
      label={label}
      validate={validate}
      validationEnabled
    />
  );
};

export { CustomDescription };

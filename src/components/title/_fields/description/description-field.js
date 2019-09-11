import React from 'react';
import { Field } from 'react-final-form';

import { TextArea } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

const MAX_CHARACTER_LENGTH = 400;

function validate(value) {
  return value && value.length > MAX_CHARACTER_LENGTH ?
    <FormattedMessage
      id="ui-eholdings.validate.errors.title.description.length"
      values={{ amount: MAX_CHARACTER_LENGTH }}
    /> : undefined;
}

export default function DescriptionField() {
  return (
    <div data-test-eholdings-description-textarea>
      <FormattedMessage id="ui-eholdings.title.description">
        {(ariaLabel) => (
          <Field
            name="description"
            component={TextArea}
            label={ariaLabel}
            validate={validate}
            aria-label={ariaLabel}
          />
        )}
      </FormattedMessage>
    </div>
  );
}

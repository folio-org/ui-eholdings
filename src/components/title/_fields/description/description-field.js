import React from 'react';
import { Field } from 'redux-form';

import { TextArea } from '@folio/stripes-components';
import { injectIntl, intlShape } from 'react-intl';

function DescriptionField({ intl }) {
  return (
    <div data-test-eholdings-description-textarea>
      <Field
        name="description"
        component={TextArea}
        label={intl.formatMessage({ id: 'ui-eholdings.title.description' })}
      />
    </div>
  );
}

DescriptionField.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(DescriptionField);

export function validate(values, props) {
  const errors = {};

  if (values.description && values.description.length > 1500) {
    errors.description = props.intl.formatMessage({
      id: 'ui-eholdings.validate.errors.title.description.length'
    });
  }

  return errors;
}

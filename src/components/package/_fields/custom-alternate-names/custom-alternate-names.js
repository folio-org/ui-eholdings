import { useCallback, useMemo } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import isEqual from 'lodash/isEqual';

import {
  InfoPopover,
  RepeatableField,
  TextArea,
} from '@folio/stripes/components';

const MAX_CHARACTER_LENGTH = 300;
const MAX_ALTERNATE_NAMES = 10;

const validate = (value) => {
  if (value?.length > MAX_CHARACTER_LENGTH) {
    return (
      <FormattedMessage
        id="ui-eholdings.validate.errors.customPackage.customAlternateName.length"
        values={{ amount: MAX_CHARACTER_LENGTH }}
      />
    );
  }

  if (value?.includes('"')) {
    return (
      <FormattedMessage id="ui-eholdings.validate.errors.customPackage.customAlternateName.doubleQuotes" />
    );
  }

  return null;
};

const CustomAlternateNames = () => {
  const intl = useIntl();

  const renderField = useCallback((repeatableFieldName) => {
    const fieldLabel = intl.formatMessage({ id: 'ui-eholdings.label.customAlternateName' });

    return (
      <Field
        name={`${repeatableFieldName}.altName`}
        type="text"
        component={TextArea}
        ariaLabel={fieldLabel}
        validate={validate}
      />
    );
  }, [intl]);

  const repeatableFieldLegend = useMemo(() => (
    <>
      <FormattedMessage id="ui-eholdings.label.customAlternateName" />
      <InfoPopover
        iconSize="small"
        content={intl.formatMessage({ id: 'ui-eholdings.label.customAlternateNames.infoPopover' })}
      />
    </>
  ), [intl]);

  const renderRepeatableField = useCallback(({ fields }) => {
    const addLabel = intl.formatMessage({ id: 'ui-eholdings.label.addCustomAlternateName' });

    const addCustomAlternateName = () => {
      if (fields.length === MAX_ALTERNATE_NAMES) {
        return;
      }

      fields.push({});
    };

    return (
      <RepeatableField
        legend={repeatableFieldLegend}
        addLabel={addLabel}
        fields={fields}
        canAdd={fields.length < MAX_ALTERNATE_NAMES}
        onAdd={addCustomAlternateName}
        onRemove={(index) => fields.remove(index)}
        renderField={renderField}
        hasMargin={false}
        hasRemoveButtonMargin={false}
      />
    );
  }, [intl, renderField, repeatableFieldLegend]);

  return (
    <FieldArray
      component={renderRepeatableField}
      isEqual={isEqual}
      name="customAltNames"
    />
  );
};

export { CustomAlternateNames };

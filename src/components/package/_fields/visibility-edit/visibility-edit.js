import { FormattedMessage } from 'react-intl';
import {
  Field,
} from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Headline,
  Checkbox,
} from '@folio/stripes/components';

import fieldsetStyles from '../../../fieldset-styles.css';

export const VisibilityEdit = () => {
  const renderFieldGroup = ({ fields }) => (
    <>
      {fields.value.map(({ category }, index) => (
        <>
          <Field
            type="checkbox"
            component={Checkbox}
            // format={value => typeof value !== 'undefined' && value !== null && value.toString()}
            label={<FormattedMessage id={`ui-eholdings.package.visibility.${category}`} />}
            name={`visibility[${index}].hidden`}
          />
        </>
      ))}
    </>
  );

  return (
    <>
      <Headline
        tag="legend"
        className={fieldsetStyles.label}
      >
        <FormattedMessage id="ui-eholdings.package.visibility" />
      </Headline>
      <FieldArray
        name="visibility"
        render={renderFieldGroup}
      />
    </>
  );
};

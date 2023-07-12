import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Headline,
  RepeatableField,
  Select,
  TextField,
  Col,
  Row,
} from '@folio/stripes/components';

import { useIntl } from 'react-intl';

import {
  identifiersTypes,
  IDENTIFIERS_FIELDS_VALUE_MAX_LENGTH,
} from '../../../../constants';

const IdentifiersFields = () => {
  const intl = useIntl();
  const labelId = intl.formatMessage({ id: 'ui-eholdings.id' });

  const validateId = (value) => {
    let error;

    if (!value) {
      error = intl.formatMessage({ id: 'ui-eholdings.validate.errors.identifiers.noBlank' });
    }

    if (value?.length >= IDENTIFIERS_FIELDS_VALUE_MAX_LENGTH) {
      error = intl.formatMessage({ id: 'ui-eholdings.validate.errors.identifiers.exceedsLength' });
    }

    return error;
  };

  const renderField = (identifier) => {
    return (
      <Row>
        <Col
          md
          xs={12}
          data-test-eholdings-identifiers-fields-type
        >
          <Field
            name={`${identifier}.flattenedType`}
            type="text"
            component={Select}
            autoFocus={Object.keys(identifier).length === 0}
            label={intl.formatMessage({ id: 'ui-eholdings.type' })}
          >
            {Object.keys(identifiersTypes).map((identifiersType, index) => {
              const label = intl.formatMessage({ id: `ui-eholdings.label.identifier.${identifiersType.toLowerCase()}` });
              const value = identifiersTypes[identifiersType];

              // we pass index as value because in `expandIdentifiers` function in routes/utils.js
              // we use index to get expanded values
              return <option key={value} value={index}>{label}</option>;
            })}
          </Field>
        </Col>
        <Col
          md
          xs={12}
          data-test-eholdings-identifiers-fields-id
        >
          <Field
            name={`${identifier}.id`}
            type="text"
            component={TextField}
            label={labelId}
            validate={validateId}
            ariaLabel={labelId}
          />
        </Col>
      </Row>
    );
  };

  return (
    <div
      data-test-eholdings-identifiers-fields
      data-testid="identifiers-fields"
    >
      <FieldArray name="identifiers">
        {({ fields, meta: { initial } }) => (
          <RepeatableField
            addLabel={intl.formatMessage({ id: 'ui-eholdings.title.identifier.addIdentifier' })}
            emptyMessage={
              initial?.length > 0 && initial[0].id
                ? intl.formatMessage({ id: 'ui-eholdings.title.identifier.notSet' })
                : ''
            }
            fields={fields}
            legend={
              <Headline tag="h4">
                {intl.formatMessage({ id: 'ui-eholdings.label.identifiers' })}
              </Headline>
            }
            onAdd={() => fields.push({})}
            onRemove={index => fields.remove(index)}
            renderField={renderField}
          />
        )}
      </FieldArray>
    </div>
  );
};

export default IdentifiersFields;

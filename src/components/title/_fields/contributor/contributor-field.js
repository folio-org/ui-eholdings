import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Headline,
  RepeatableField,
  Select,
  TextField,
  Row,
  Col,
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import { CONTRIBUTOR_FIELD_VALUE_MAX_LENGTH } from '../../../../constants';

const contributorTypeOptions = [
  {
    value: 'author',
    translationIdEnding: 'author',
  },
  {
    value: 'editor',
    translationIdEnding: 'editor',
  },
  {
    value: 'illustrator',
    translationIdEnding: 'illustrator',
  },
];

const validateName = (value) => {
  let errors;

  if (!value) {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.contributor.empty" />;
  }

  if (value?.length >= CONTRIBUTOR_FIELD_VALUE_MAX_LENGTH) {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.contributor.exceedsLength" />;
  }

  return errors;
};

const addNewField = (fields) => {
  const defaultContributorTypeOption = contributorTypeOptions[0].value;

  fields.push({ type: defaultContributorTypeOption });
};

const renderContributorTypeOptions = () => {
  return contributorTypeOptions.map(({ value, translationIdEnding }) => (
    <FormattedMessage id={`ui-eholdings.label.${translationIdEnding}`}>
      {message => <option value={value}>{message}</option>}
    </FormattedMessage>
  ));
};

const renderContributorTypeField = (contributor) => {
  return (
    <Col
      md
      xs={12}
      data-test-eholdings-contributor-type
    >
      <Field
        name={`${contributor}.type`}
        component={Select}
        autoFocus
        label={<FormattedMessage id="ui-eholdings.type" />}
        id={`${contributor}-type`}
      >
        {renderContributorTypeOptions()}
      </Field>
    </Col>
  );
};

const renderContributorNameField = (contributor) => {
  return (
    <Col
      md
      xs={12}
      data-test-eholdings-contributor-contributor
    >
      <Field
        name={`${contributor}.contributor`}
        type="text"
        id={`${contributor}-input`}
        component={TextField}
        label={<FormattedMessage id="ui-eholdings.name" />}
        validate={validateName}
      />
    </Col>
  );
};

const renderFields = (contributor) => {
  return (
    <Row>
      {renderContributorTypeField(contributor)}
      {renderContributorNameField(contributor)}
    </Row>
  );
};

const ContributorField = () => {
  const addLabel = <FormattedMessage id="ui-eholdings.title.contributor.addContributor" />;

  const legend = (
    <Headline tag="h4">
      <FormattedMessage id="ui-eholdings.label.contributors" />
    </Headline>
  );

  return (
    <div
      data-test-eholdings-contributors-fields
      data-testid="contributor-field"
    >
      <FieldArray name="contributors">
        {({ fields, meta: { initial } }) => {
          const areInitialValuesPassed = initial?.length;
          const emptyMessage = areInitialValuesPassed
            ? <FormattedMessage id="ui-eholdings.title.contributor.notSet" />
            : '';

          return (
            <RepeatableField
              addLabel={addLabel}
              emptyMessage={emptyMessage}
              fields={fields}
              legend={legend}
              onAdd={() => addNewField(fields)}
              onRemove={fields.remove}
              renderField={renderFields}
            />
          );
        }}
      </FieldArray>
    </div>
  );
};

export default ContributorField;

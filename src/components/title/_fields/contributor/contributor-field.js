import React, { Component } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Headline,
  RepeatableField,
  Select,
  TextField
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import styles from './contributor-field.css';

const contributorTypeOptions = [
  {
    value: 'author',
    translationIdEnding: 'author'
  },
  {
    value: 'editor',
    translationIdEnding: 'editor'
  },
  {
    value: 'illustrator',
    translationIdEnding: 'illustrator'
  },
];

export default class ContributorField extends Component {
  validateName(value) {
    let errors;

    if (!value) {
      errors = <FormattedMessage id="ui-eholdings.validate.errors.contributor.empty" />;
    }

    if (value && value.length >= 250) {
      errors = <FormattedMessage id="ui-eholdings.validate.errors.contributor.exceedsLength" />;
    }

    return errors;
  }

  addNewField(fields) {
    const defaultContributorTypeOption = contributorTypeOptions[0].value;

    fields.push({ type: defaultContributorTypeOption });
  }

  renderContributorTypeField(contributor) {
    return (
      <div
        data-test-eholdings-contributor-type
        className={styles['contributor-fields-type']}
      >
        <Field
          name={`${contributor}.type`}
          component={Select}
          autoFocus
          label={<FormattedMessage id="ui-eholdings.type" />}
          id={`${contributor}-type`}
          validate={this.validateContributorType}
        >
          {this.renderContributorTypeOptions()}
        </Field>
      </div>
    );
  }

  renderContributorTypeOptions() {
    return contributorTypeOptions.map(({ value, translationIdEnding }) => (
      <FormattedMessage id={`ui-eholdings.label.${translationIdEnding}`}>
        {message => <option value={value}>{message}</option>}
      </FormattedMessage>
    ));
  }

  renderContributorNameField(contributor) {
    return (
      <div
        data-test-eholdings-contributor-contributor
        className={styles['contributor-fields-name']}
      >
        <Field
          name={`${contributor}.contributor`}
          type="text"
          id={`${contributor}-input`}
          component={TextField}
          label={<FormattedMessage id="ui-eholdings.name" />}
          validate={this.validateName}
        />
      </div>
    );
  }

  renderFields = (contributor) => {
    return (
      <div className={styles['contributor-fields']}>
        {this.renderContributorTypeField(contributor)}
        {this.renderContributorNameField(contributor)}
      </div>
    );
  }

  render() {
    const addLabel = <FormattedMessage id="ui-eholdings.title.contributor.addContributor" />;

    const legend = (
      <Headline tag="h4">
        <FormattedMessage id="ui-eholdings.label.contributors" />
      </Headline>
    );

    return (
      <div data-test-eholdings-contributors-fields>
        <FieldArray name="contributors">
          {({ fields, meta: { initial } }) => {
            const areInitialValuesPassed = initial && initial.length;
            const emptyMessage = areInitialValuesPassed
              ? <FormattedMessage id="ui-eholdings.title.contributor.notSet" />
              : '';

            return (
              <RepeatableField
                addLabel={addLabel}
                emptyMessage={emptyMessage}
                fields={fields}
                legend={legend}
                onAdd={() => this.addNewField(fields)}
                onRemove={fields.remove}
                renderField={this.renderFields}
              />
            );
          }}
        </FieldArray>
      </div>
    );
  }
}

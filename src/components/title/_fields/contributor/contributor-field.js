import React, { Component, Fragment } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Headline,
  Icon,
  RepeatableField,
  Select,
  TextField
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import styles from './contributor-field.css';

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

  renderField = (contributor) => {
    return (
      <Fragment>
        <div
          data-test-eholdings-contributor-type
          className={styles['contributor-fields-contributor']}
        >
          <Field
            name={`${contributor}.type`}
            component={Select}
            autoFocus={Object.keys(contributor).length === 0}
            label={<FormattedMessage id="ui-eholdings.type" />}
            id={`${contributor}-type`}
          >
            <FormattedMessage id="ui-eholdings.label.author">
              {(message) => <option value="author">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.editor">
              {(message) => <option value="editor">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.illustrator">
              {(message) => <option value="illustrator">{message}</option>}
            </FormattedMessage>
          </Field>
        </div>
        <div
          data-test-eholdings-contributor-contributor
          className={styles['contributor-fields-contributor']}
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
      </Fragment>
    );
  }

  render() {
    return (
      <div data-test-eholdings-contributors-fields>
        <FieldArray name="contributors">
          {({ fields, meta: { initial } }) => (
            <RepeatableField
              addLabel={
                <Icon icon="plus-sign">
                  <FormattedMessage id="ui-eholdings.title.contributor.addContributor" />
                </Icon>
              }
              emptyMessage={
                initial && initial.length > 0 && initial[0].contributor ?
                  <FormattedMessage id="ui-eholdings.title.contributor.notSet" /> : ''
              }
              fields={fields}
              legend={
                <Headline tag="h4">
                  <FormattedMessage id="ui-eholdings.label.contributors" />
                </Headline>
              }
              onAdd={() => fields.push({})}
              onRemove={index => fields.remove(index)}
              renderField={this.renderField}
            />
          )}
        </FieldArray>
      </div>
    );
  }
}

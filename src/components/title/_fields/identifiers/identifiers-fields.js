import React, { Component, Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';

import {
  Headline,
  RepeatableField,
  Select,
  TextField
} from '@folio/stripes/components';

import { FormattedMessage } from 'react-intl';
import styles from './identifiers-fields.css';

export default class IdentifiersFields extends Component {
  static propTypes = {
    initialValue: PropTypes.array,
  };

  validateId(value) {
    let errors;

    if (!value) {
      errors = <FormattedMessage id="ui-eholdings.validate.errors.identifiers.noBlank" />;
    }

    if (value && value.length >= 20) {
      errors = <FormattedMessage id="ui-eholdings.validate.errors.identifiers.exceedsLength" />;
    }

    return errors;
  }

  renderField = (identifier, index, fields) => {
    return (
      <Fragment>
        <div
          data-test-eholdings-identifiers-fields-type
          className={styles['identifiers-fields-field']}
        >
          <Field
            name={`${identifier}.flattenedType`}
            type="text"
            component={Select}
            autoFocus={Object.keys(fields.get(index)).length === 0}
            label={<FormattedMessage id="ui-eholdings.type" />}
          >
            <FormattedMessage id="ui-eholdings.label.identifier.issnOnline">
              {(message) => <option value="0">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.identifier.issnPrint">
              {(message) => <option value="1">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.identifier.isbnOnline">
              {(message) => <option value="2">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.identifier.isbnPrint">
              {(message) => <option value="3">{message}</option>}
            </FormattedMessage>
          </Field>
        </div>
        <div
          data-test-eholdings-identifiers-fields-id
          className={styles['identifiers-fields-field']}
        >
          <Field
            name={`${identifier}.id`}
            type="text"
            component={TextField}
            label={<FormattedMessage id="ui-eholdings.id" />}
            validate={this.validateId}
          />
        </div>
      </Fragment>
    );
  }

  render() {
    const { initialValue } = this.props;

    return (
      <div data-test-eholdings-identifiers-fields>
        <FieldArray
          addLabel={<FormattedMessage id="ui-eholdings.title.identifier.addIdentifier" />}
          component={RepeatableField}
          emptyMessage={
            initialValue && initialValue.length > 0 && initialValue[0].id ?
              <FormattedMessage id="ui-eholdings.title.identifier.notSet" /> : ''
          }
          legend={<Headline tag="h4"><FormattedMessage id="ui-eholdings.label.identifiers" /></Headline>}
          name="identifiers"
          renderField={this.renderField}
        />
      </div>
    );
  }
}

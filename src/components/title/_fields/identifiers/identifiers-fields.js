import React, { Component, Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';

import {
  RepeatableField,
  Select,
  TextField
} from '@folio/stripes/components';

import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styles from './identifiers-fields.css';

class IdentifiersFields extends Component {
  static propTypes = {
    initialValue: PropTypes.array,
    intl: intlShape.isRequired
  };

  static defaultProps = {
    initialValue: []
  };

  renderField = (identifier, index, fields) => {
    const { intl } = this.props;

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
            label={intl.formatMessage({ id: 'ui-eholdings.type' })}
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
            label={intl.formatMessage({ id: 'ui-eholdings.id' })}
          />
        </div>
      </Fragment>
    );
  }

  render() {
    const { initialValue, intl } = this.props;

    return (
      <div data-test-eholdings-identifiers-fields>
        <FieldArray
          addLabel={intl.formatMessage({ id: 'ui-eholdings.title.identifier.addIdentifier' })}
          component={RepeatableField}
          emptyMessage={
            initialValue.length > 0 && initialValue[0].id ?
              intl.formatMessage({ id: 'ui-eholdings.title.identifier.notSet' }) : ''
          }
          legend={intl.formatMessage({ id: 'ui-eholdings.label.identifiers' })}
          name="identifiers"
          renderField={this.renderField}
        />
      </div>
    );
  }
}

export function validate(values, { intl }) {
  let errors = [];

  values.identifiers.forEach((identifier, index) => {
    let identifierErrors = {};

    if (!identifier.id) {
      identifierErrors.id = intl.formatMessage({ id: 'ui-eholdings.validate.errors.identifiers.noBlank' });
    }

    if (identifier.id && identifier.id.length >= 20) {
      identifierErrors.id = intl.formatMessage({ id: 'ui-eholdings.validate.errors.identifiers.exceedsLength' });
    }

    errors[index] = identifierErrors;
  });

  return { identifiers: errors };
}

export default injectIntl(IdentifiersFields);

import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';

import {
  Button,
  IconButton,
  Select,
  TextField
} from '@folio/stripes-components';

import { injectIntl, intlShape } from 'react-intl';
import styles from './identifiers-fields.css';

class IdentifiersFields extends Component {
  static propTypes = {
    initialValue: PropTypes.array,
    intl: intlShape.isRequired
  };

  static defaultProps = {
    initialValue: []
  };

  renderIdentifierFields = ({ fields }) => {
    let { initialValue, intl } = this.props;

    return (
      <fieldset className={styles['identifiers-fields']}>
        <legend>Identifiers</legend>

        {fields.length === 0
          && initialValue.length > 0
          && initialValue[0].id
          && (
          <p data-test-eholdings-identifiers-fields-saving-will-remove>
            {intl.formatMessage({ id: 'ui-eholdings.title.identifier.notSet' })}
          </p>
        )}

        {fields.length > 0 && (
          <ul className={styles['identifiers-fields-rows']}>
            {fields.map((identifier, index, allFields) => (
              <li
                data-test-eholdings-identifiers-fields-row
                key={index}
                className={styles['identifiers-fields-row']}
              >
                <div
                  data-test-eholdings-identifiers-fields-type
                  className={styles['identifiers-fields-field']}
                >
                  <Field
                    name={`${identifier}.flattenedType`}
                    type="text"
                    component={Select}
                    autoFocus={Object.keys(allFields.get(index)).length === 0}
                    label={intl.formatMessage({ id: 'ui-eholdings.type' })}
                    dataOptions={[
                      { value: '0', label: 'ISSN (Online)' },
                      { value: '1', label: 'ISSN (Print)' },
                      { value: '2', label: 'ISBN (Online)' },
                      { value: '3', label: 'ISBN (Print)' }
                    ]}
                  />
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

                <div
                  data-test-eholdings-identifiers-fields-remove-row-button
                  className={styles['identifiers-fields-clear-row']}
                >
                  <IconButton
                    icon="hollowX"
                    ariaLabel={`Remove ${allFields.get(index).id}`}
                    onClick={() => fields.remove(index)}
                    size="small"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        <div
          className={styles['identifiers-fields-add-row-button']}
          data-test-eholdings-identifiers-fields-add-row-button
        >
          <Button
            type="button"
            onClick={() => fields.push({})}
          >
            {intl.formatMessage({ id: 'ui-eholdings.title.identifier.addIdentifier' })}
          </Button>
        </div>
      </fieldset>
    );
  };

  render() {
    return (
      <FieldArray name="identifiers" component={this.renderIdentifierFields} />
    );
  }
}

export function validate(values) {
  let errors = [];

  values.identifiers.forEach((identifier, index) => {
    let identifierErrors = {};

    if (!identifier.id) {
      identifierErrors.id = 'ID cannot be blank.';
    }

    if (identifier.id && identifier.id.length >= 20) {
      identifierErrors.id = 'Must be less than 20 characters.';
    }

    errors[index] = identifierErrors;
  });

  return { identifiers: errors };
}

export default injectIntl(IdentifiersFields);

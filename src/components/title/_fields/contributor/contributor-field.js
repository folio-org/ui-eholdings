import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import {
  TextField,
  Select,
  Button,
  IconButton
} from '@folio/stripes-components';
import styles from './contributor-field.css';

class ContributorField extends Component {
  renderContributorFields = ({ fields }) => {
    function renderFields() {
      return (
        <ul className={styles['contributor-fields-rows']}>
          {fields.map((contributor, index) => (
            <li
              data-test-eholdings-contributor-fields-row
              className={styles['contributor-fields-row']}
              key={index}
            >
              <div className={styles['contributor-fields-contributor']}>
                {/* TODO: Only do autoFocus for the first field, when NEW */}
                <Field
                  name={`${contributor}.contributor`}
                  type="text"
                  autoFocus
                  component={TextField}
                  label="Contributor"
                />
              </div>

              <div className={styles['contributor-fields-contributor']}>
                <Field
                  name={`${contributor}.type`}
                  component={Select}
                  label="Contributor Type"
                  dataOptions={[
                    { value: 'author', label: 'Author' },
                    { value: 'editor', label: 'Editor' },
                    { value: 'illustrator', label: 'Illustrator' }
                  ]}
                />
              </div>
              <div
                data-test-eholdings-contributor-fields-remove-row-button
                className={styles['contributor-fields-clear-row']}
              >
                <IconButton
                  icon="hollowX"
                  onClick={() => fields.remove(index)}
                  size="small"
                />
              </div>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className={styles['contributor-fields']}>
        {fields.length !== 0 ? renderFields() : null}
        <div
          data-test-eholdings-contributor-fields-add-row-button
        >
          <Button
            type="button"
            onClick={() => fields.push({})}
          >
            + Add contributer
          </Button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <FieldArray name="contributors" component={this.renderContributorFields} />
    );
  }
}

export function validate(values) {
  const errors = {};

  values.contributors.forEach((contributor, index) => {
    let contributorErrors = {};

    if (!contributor.contributor.length) {
      contributorErrors.contributor = 'You must provide a contributor';
    }

    if (contributor.contributor.length > 250) {
      contributorErrors.contributor = 'A contributor must be less than 250 characters';
    }

    errors[index] = contributorErrors;
  });

  return { contributors: errors };
}

export default ContributorField;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import {
  TextField,
  Select,
  Button,
  IconButton
} from '@folio/stripes-components';
import { injectIntl, intlShape } from 'react-intl';
import styles from './contributor-field.css';

class ContributorField extends Component {
  static propTypes = {
    initialValue: PropTypes.array,
    intl: intlShape.isRequired
  };

  static defaultProps = {
    initialValue: []
  };

  renderContributorFields = ({ fields }) => {
    let { initialValue, intl } = this.props;

    function renderFields() {
      return (
        <ul className={styles['contributor-fields-rows']}>
          {fields.map((contributor, index, allFields) => (
            <li
              className={styles['contributor-fields-row']}
              key={index}
            >
              <div
                data-test-eholdings-contributor-type
                className={styles['contributor-fields-contributor']}
              >
                <Field
                  name={`${contributor}.type`}
                  component={Select}
                  autoFocus={Object.keys(allFields.get(index)).length === 0}
                  label={intl.formatMessage({ id: 'ui-eholdings.type' })}
                  id={`${contributor}-type`}
                  dataOptions={[
                    { value: 'author', label: 'Author' },
                    { value: 'editor', label: 'Editor' },
                    { value: 'illustrator', label: 'Illustrator' }
                  ]}
                />
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
                  label={intl.formatMessage({ id: 'ui-eholdings.name' })}
                />
              </div>

              <div
                data-test-eholdings-contributor-fields-remove-row-button
                className={styles['contributor-fields-clear-row']}
              >
                <IconButton
                  icon="hollowX"
                  aria-label={`Remove ${allFields.get(index).contributor}`}
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
      <fieldset className={styles['contributor-fields']}>
        <legend>Contributors</legend>
        {fields.length === 0
          && initialValue.length > 0
          && initialValue[0].id
          && (
          <p data-test-eholdings-contributors-fields-saving-will-remove>
            {intl.formatMessage({ id: 'ui-eholdings.title.contributor.notSet' })}
          </p>
        )}
        {fields.length !== 0 ? renderFields() : null}
        <div
          data-test-eholdings-contributor-fields-add-row-button
        >
          <Button
            type="button"
            onClick={() => fields.push({})}
          >
            {intl.formatMessage({ id: 'ui-eholdings.title.contributor.addContributor' })}
          </Button>
        </div>
      </fieldset>
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

  values.contributors.forEach((contributorObj, index) => {
    let contributorErrors = {};
    let isEmptyObject = Object.keys(contributorObj).length === 0;
    let contributor = contributorObj.contributor;
    let isEmptyString = typeof contributor === 'string' && !contributor.trim();

    if (isEmptyString || isEmptyObject) {
      contributorErrors.contributor = 'You must provide a contributor';
    }

    if (contributor && contributor.length >= 250) {
      contributorErrors.contributor = 'A contributor must be less than 250 characters';
    }

    errors[index] = contributorErrors;
  });

  return { contributors: errors };
}

export default injectIntl(ContributorField);

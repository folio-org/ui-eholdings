import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import {
  RepeatableField,
  Select,
  TextField
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import styles from './contributor-field.css';

class ContributorField extends Component {
  static propTypes = {
    initialValue: PropTypes.array,
  };

  static defaultProps = {
    initialValue: []
  };

  renderField = (contributor, index, fields) => {
    return (
      <Fragment>
        <div
          data-test-eholdings-contributor-type
          className={styles['contributor-fields-contributor']}
        >
          <Field
            name={`${contributor}.type`}
            component={Select}
            autoFocus={Object.keys(fields.get(index)).length === 0}
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
          />
        </div>
      </Fragment>
    );
  }

  render() {
    const { initialValue } = this.props;

    return (
      <div data-test-eholdings-contributor-field>
        <FieldArray
          addLabel={<FormattedMessage id="ui-eholdings.title.contributor.addContributor" />}
          component={RepeatableField}
          emptyMessage={
            initialValue.length > 0 && initialValue[0].contributor ?
              <FormattedMessage id="ui-eholdings.title.contributor.notSet" /> : ''
          }
          legend={<FormattedMessage id="ui-eholdings.label.contributors" />}
          name="contributors"
          renderField={this.renderField}
        />
      </div>
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
      contributorErrors.contributor = <FormattedMessage id="ui-eholdings.validate.errors.contributor.empty" />;
    }

    if (contributor && contributor.length >= 250) {
      contributorErrors.contributor = <FormattedMessage id="ui-eholdings.validate.errors.contributor.exceedsLength" />;
    }

    errors[index] = contributorErrors;
  });

  return { contributors: errors };
}

export default ContributorField;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import {
  Button,
  IconButton,
  Select,
  TextField
} from '@folio/stripes-components';
import styles from './custom-embargo-fields.css';

export default class CustomEmbargoFields extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    showInputs: PropTypes.bool,
    initialValue: PropTypes.object
  };

  state = {
    showInputs: this.props.showInputs
  };

  clearValues = () => {
    this.props.change('customEmbargoValue', 0);
    this.props.change('customEmbargoUnit', '');
    this.toggleInputs();
  }

  toggleInputs = () => {
    this.setState(({ showInputs }) => ({
      showInputs: !showInputs
    }));
  }

  render() {
    let { initialValue } = this.props;
    let { showInputs } = this.state;

    return (showInputs) ? (
      <div className={styles['custom-embargo-fields']}>
        <div
          data-test-eholdings-custom-embargo-textfield
          className={styles['custom-embargo-text-field']}
        >
          <Field
            name="customEmbargoValue"
            component={TextField}
            placeholder="Number"
            autoFocus={initialValue.customEmbargoValue === 0}
          />
        </div>

        <div
          data-test-eholdings-custom-embargo-select
          className={styles['custom-embargo-select']}
        >
          <Field
            name="customEmbargoUnit"
            component={Select}
            dataOptions={[
              { value: '', label: 'Select time period' },
              { value: 'Days', label: 'Days' },
              { value: 'Weeks', label: 'Weeks' },
              { value: 'Months', label: 'Months' },
              { value: 'Years', label: 'Years' }
            ]}
          />
        </div>

        <div
          data-test-eholdings-custom-embargo-remove-row-button
          className={styles['custom-embargo-clear-row']}
        >
          <IconButton
            icon="hollowX"
            onClick={this.clearValues}
            size="small"
            ariaLabel="Clear embargo period"
          />
        </div>
      </div>
    ) : (
      <div>
        {initialValue.customEmbargoValue !== 0
          && (
          <p data-test-eholdings-embargo-fields-saving-will-remove>
            Nothing set. Saving will remove custom embargo period.
          </p>
        )}

        <div
          className={styles['custom-embargo-add-row-button']}
          data-test-eholdings-custom-embargo-add-row-button
        >
          <Button
            type="button"
            onClick={this.toggleInputs}
          >
            + Add custom embargo period
          </Button>
        </div>
      </div>
    );
  }
}

export function validate(values) {
  const errors = {};


  if (Number.isNaN(Number(values.customEmbargoValue))) {
    errors.customEmbargoValue = 'Must be a number';
  }

  if (values.customEmbargoValue <= 0) {
    errors.customEmbargoValue = 'Enter number greater than 0';
  }

  if (values.customEmbargoValue > 0 && !values.customEmbargoUnit) {
    errors.customEmbargoUnit = 'Select a unit';
  }
  return errors;
}

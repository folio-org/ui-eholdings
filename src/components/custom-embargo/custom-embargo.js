import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Select from '@folio/stripes-components/lib/Select';
import styles from './custom-embargo.css';

class CustomEmbargoForm extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      customEmbargoValue: PropTypes.number,
      customEmbargoUnit: PropTypes.string,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    isPending: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func,
    change: PropTypes.func
  };

  state = {
    isEditing: false,
  };

  handleEditCustomEmbargo = (e) => {
    let isEditing = !this.state.isEditing;
    e.preventDefault();
    this.setState({ isEditing });
  }

  handleSubmit = (data) => {
    this.setState({
      isEditing: false
    });
    this.props.onSubmit(data);
  }

  handleCancelCustomEmbargo = (e) => {
    e.preventDefault();
    this.setState({
      isEditing: false
    });
    this.props.initialize(this.props.initialValues);
  }

  renderTextField = ({ input, meta: { touched, error } }) => {
    return (
      <div>
        <TextField
          {...input}
        />
        {touched && ((error && <span className={styles['error-message']}>{error}</span>))}
      </div>
    );
  }

  renderDropDown = ({ input, meta: { touched, error } }) => {
    return (
      <div>
        <Select
          {...input}
          dataOptions={[
            { value: '', label: 'None' },
            { value: 'Days', label: 'Days' },
            { value: 'Weeks', label: 'Weeks' },
            { value: 'Months', label: 'Months' },
            { value: 'Years', label: 'Years' }
          ]}
        />
        {touched && ((error && <span className={styles['error-message']}>{error}</span>))}
      </div>
    );
  }

  render() {
    let { isPending, change } = this.props;

    const { customEmbargoValue, customEmbargoUnit } = this.props.initialValues;

    if (this.state.isEditing) {
      return (
        <form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
          <div
            data-test-eholdings-customer-resource-custom-embargo-form
            className={styles['custom-embargo-form-editing']}
          >
            <div className={styles['custom-embargo-container']}>
              <div className={styles['custom-embargo-component-width']}>
                <div data-test-eholdings-customer-resource-custom-embargo-textfield className={styles['custom-embargo-text-field']}>
                  <Field
                    name='customEmbargoValue'
                    type="number"
                    parse={value => (!value ? null : (isNaN(value) ? '' : Number(value)))} // eslint-disable-line no-restricted-globals
                    component={this.renderTextField}
                  />
                </div>
              </div>
              <div className={styles['custom-embargo-component-width']}>
                <div data-test-eholdings-customer-resource-custom-embargo-select className={styles['flex-item-right-bottom-margin']}>
                  <Field
                    name='customEmbargoUnit'
                    component={this.renderDropDown}
                    onChange={(event, newValue) => {
                      if (newValue === '') {
                        change('customEmbargoValue', 0);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles['custom-embargo-action-buttons']}>
              <div data-test-eholdings-customer-resource-cancel-custom-embargo-button>
                <Button disabled={isPending} type="button" role="button" onClick={this.handleCancelCustomEmbargo}>
                  Cancel
                </Button>
              </div>
              <div data-test-eholdings-customer-resource-save-custom-embargo-button>
                <Button type="submit" role="button" buttonStyle="primary">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      );
    } else if (customEmbargoValue && customEmbargoUnit) {
      return (
        <div className={styles['custom-embargo-form']}>
          <div className={styles['custom-embargo-display']}>
            <div data-test-eholdings-customer-resource-custom-embargo-display className={styles['custom-embargo']}>
              {customEmbargoValue} {customEmbargoUnit}
            </div>
            <div data-test-eholdings-customer-resource-edit-custom-embargo-button>
              <IconButton icon="edit" onClick={this.handleEditCustomEmbargo} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles['custom-embargo-form']}>
          <div data-test-eholdings-customer-resource-add-custom-embargo-button>
            <Button
              type="button"
              onClick={this.handleEditCustomEmbargo}
            >
              Add Custom Embargo
            </Button>
          </div>
        </div>
      );
    }
  }
}

// this function is a special function used by redux-form for form validation
// the values from the form are passed into this function and then
// validated based on the matching field with the same 'name' as value
const validate = (values) => {
  const errors = {};

  if (isNaN(Number(values.customEmbargoValue))) { // eslint-disable-line no-restricted-globals
    errors.customEmbargoValue = 'Must be a number';
  }

  if (values.customEmbargoValue === null) {
    errors.customEmbargoValue = 'Value cannot be null';
  }

  if (values.customEmbargoValue < 0 || (values.customEmbargoValue === 0 && values.customEmbargoUnit !== '')) {
    errors.customEmbargoValue = 'Enter value greater than 0';
  }

  if (values.customEmbargoValue > 0 && values.customEmbargoUnit === '') {
    errors.customEmbargoUnit = 'Select a valid unit';
  }
  return errors;
};

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'CustomEmbargo',
  destroyOnUnmount: false
})(CustomEmbargoForm);

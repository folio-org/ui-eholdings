import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import isEqual from 'lodash/isEqual';

import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Icon from '@folio/stripes-components/lib/Icon';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Select from '@folio/stripes-components/lib/Select';
import KeyValueLabel from '../key-value-label';
import styles from './custom-embargo.css';

const cx = classNames.bind(styles);

class CustomEmbargoForm extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      customEmbargoValue: PropTypes.number,
      customEmbargoUnit: PropTypes.string,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    isPending: PropTypes.bool,
    handleSubmit: PropTypes.func,
    initialize: PropTypes.func,
    change: PropTypes.func,
    pristine: PropTypes.bool
  };

  state = {
    isEditing: false,
  };

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.isPending && !nextProps.isPending;
    let needsUpdate = !isEqual(this.props.initialValues, nextProps.initialValues);

    if (wasPending && needsUpdate) {
      this.setState({ isEditing: false });
    }
  }

  handleEditCustomEmbargo = (e) => {
    let isEditing = !this.state.isEditing;
    e.preventDefault();
    this.setState({ isEditing });
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
    let { pristine, isPending, change, handleSubmit, onSubmit } = this.props;
    const { customEmbargoValue, customEmbargoUnit } = this.props.initialValues;
    let contents;

    if (this.state.isEditing) {
      contents = (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    parse={value => (!value ? null : (Number.isNaN(value) ? '' : Number(value)))}
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
              <div
                data-test-eholdings-customer-resource-cancel-custom-embargo-button
                className={styles['custom-embargo-action-button']}
              >
                <Button
                  disabled={isPending}
                  type="button"
                  role="button"
                  onClick={this.handleCancelCustomEmbargo}
                  marginBottom0 // gag
                >
                  Cancel
                </Button>
              </div>
              <div
                data-test-eholdings-customer-resource-save-custom-embargo-button
                className={styles['custom-embargo-action-button']}
              >
                <Button
                  disabled={pristine || isPending}
                  type="submit"
                  role="button"
                  buttonStyle="primary"
                  marginBottom0 // gag
                >
                  Save
                </Button>
              </div>
              {isPending && (
                <Icon icon="spinner-ellipsis" />
              )}
            </div>
          </div>
        </form>
      );
    } else if (customEmbargoValue && customEmbargoUnit) {
      contents = (
        <div className={styles['custom-embargo-display']}>
          <KeyValueLabel label="Custom">
            <span data-test-eholdings-customer-resource-custom-embargo-display>
              {customEmbargoValue} {customEmbargoUnit}
            </span>
          </KeyValueLabel>
          <div data-test-eholdings-customer-resource-edit-custom-embargo-button>
            <IconButton icon="edit" onClick={this.handleEditCustomEmbargo} />
          </div>
        </div>
      );
    } else {
      contents = (
        <div data-test-eholdings-customer-resource-add-custom-embargo-button>
          <Button
            type="button"
            onClick={this.handleEditCustomEmbargo}
          >
            Set custom embargo period
          </Button>
        </div>
      );
    }

    return (
      <div
        data-test-eholdings-coverage-form
        className={cx(styles['custom-embargo-form'], {
          'is-editing': this.state.isEditing
        })}
      >
        <h4>Embargo period</h4>
        {contents}
      </div>
    );
  }
}

// this function is a special function used by redux-form for form validation
// the values from the form are passed into this function and then
// validated based on the matching field with the same 'name' as value
const validate = (values) => {
  const errors = {};

  if (Number.isNaN(Number(values.customEmbargoValue))) {
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

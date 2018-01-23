import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import moment from 'moment';

import Datepicker from '@folio/stripes-components/lib/Datepicker';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Button from '@folio/stripes-components/lib/Button';
import KeyValueLabel from '../key-value-label';
import { formatISODateWithoutTime } from '../utilities';
import styles from './custom-coverage-form.css';

class CustomCoverageForm extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      beginCoverage: PropTypes.string,
      endCoverage: PropTypes.string
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    initialize: PropTypes.func,
    isPending: PropTypes.bool,
    change: PropTypes.func
  };

  static contextTypes = {
    intl: PropTypes.object
  };

  state = {
    isEditing: false
  };

  renderDatepicker = ({ input, label, meta }) => {
    return (
      <div>
        <Datepicker
          label={label}
          input={input}
          onFocus={input.onFocus}
          onChange={input.onChange}
          value={input.value}
          meta={meta}
        />
      </div>
    );
  }

  handleEditCustomCoverage = (event) => {
    let isEditing = !this.state.isEditing;
    event.preventDefault();
    this.setState({ isEditing });
  }

  handleCancelCustomCoverage = (event) => {
    event.preventDefault();
    this.setState({
      isEditing: false
    });
    this.props.initialize(this.props.initialValues);
  }

  handleDeleteCustomCoverage = (event) => {
    event.preventDefault();
    this.props.change('beginCoverage', '');
    this.props.change('endCoverage', '');
  }

  handleSubmit = (data) => {
    this.setState({
      isEditing: false
    });
    if (this.props.pristine) {
      return;
    }
    this.props.onSubmit(data);
  }

  render() {
    let { pristine, isPending } = this.props;
    let { intl } = this.context;

    const { beginCoverage, endCoverage } = this.props.initialValues;
    if (this.state.isEditing) {
      return (
        <form onSubmit={this.props.handleSubmit(this.handleSubmit)} className={styles['custom-coverage-form-editing']}>
          <KeyValueLabel label="Custom Coverage">
            <div
              data-test-eholdings-custom-coverage-inputs
              className={styles['custom-coverage-dates']}
            >
              <div data-test-eholdings-custom-coverage-begin-coverage className={styles['custom-coverage-date-picker']}>
                <Field
                  name='beginCoverage'
                  component={this.renderDatepicker}
                  label="Start Date"
                />
              </div>
              <div data-test-eholdings-custom-coverage-end-coverage className={styles['custom-coverage-date-picker']}>
                <Field
                  name='endCoverage'
                  component={this.renderDatepicker}
                  label="End Date"
                />
              </div>
              <div data-test-eholdings-custom-coverage-clear-button className={styles['custom-coverage-date-clear-row']}>
                {this.props.initialValues.beginCoverage && (
                  <IconButton icon="hollowX" onClick={this.handleDeleteCustomCoverage} size="small" />
                )}
              </div>
            </div>
            <div className={styles['custom-coverage-action-buttons']}>
              <div data-test-eholdings-custom-coverage-save-button>
                <Button disabled={pristine} type="submit" role="button" buttonStyle="primary">
                  Save
                </Button>
              </div>
              <div data-test-eholdings-custom-coverage-cancel-custom-coverage-button>
                <Button disabled={isPending} hollow type="button" role="button" onClick={this.handleCancelCustomCoverage} buttonStyle="secondary">
                  Cancel
                </Button>
              </div>
            </div>
          </KeyValueLabel>
        </form>
      );
    } else if (beginCoverage) {
      return (
        <div className={styles['custom-coverage-form']}>
          <div className={styles['custom-coverage-date-display']}>
            <KeyValueLabel label="Custom Coverage">
              <div data-test-eholdings-custom-coverage-display className={styles['custom-coverage-dates']}>
                {formatISODateWithoutTime(beginCoverage, intl)} - {formatISODateWithoutTime(endCoverage, intl) || 'Present'}
              </div>
            </KeyValueLabel>
            <div data-test-eholdings-custom-coverage-edit-button>
              <IconButton icon="edit" onClick={this.handleEditCustomCoverage} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles['custom-coverage-form']}>
          <KeyValueLabel label="Custom Coverage">
            <div data-test-eholdings-custom-coverage-add-button className={styles['custom-coverage-add-button']}>
              <Button
                hollow
                buttonStyle="primary"
                type="button"
                onClick={this.handleEditCustomCoverage}
              >
                Add Custom Coverage
              </Button>
            </div>
          </KeyValueLabel>
        </div>
      );
    }
  }
}

// this function is a special function used by redux-form for form validation
// the values from the from are passed into this function and then
// validated based on the matching field with the same 'name' as value
function validate(values, props) {
  let dateFormat = props.intl.formatters.getDateTimeFormat().format();
  const errors = {};

  if (values.beginCoverage && !moment(values.beginCoverage).isValid()) {
    errors.beginCoverage = `Enter Date in ${dateFormat} format.`;
  }

  if (values.endCoverage && moment(values.beginCoverage).isAfter(values.endCoverage)) {
    errors.beginCoverage = 'Start Date must be before End Date';
  }

  return errors;
}

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'CustomCoverage',
})(CustomCoverageForm);

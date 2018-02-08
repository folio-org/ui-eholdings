import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import moment from 'moment';

import Datepicker from '@folio/stripes-components/lib/Datepicker';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Button from '@folio/stripes-components/lib/Button';
import styles from './custom-coverage-date.css';

import { formatISODateWithoutTime } from '../utilities';

class CustomCoverageDate extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      beginCoverage: PropTypes.string,
      endCoverage: PropTypes.string
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    initialize: PropTypes.func,
    isPending: PropTypes.bool
  }

  static contextTypes = {
    intl: PropTypes.object
  }

  state = {
    isEditing: false
  }

  renderDatepicker = ({ input, label, meta }) => {
    return (
      <div>
        <Datepicker
          label={label}
          input={input}
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
    let data = {
      beginCoverage: '',
      endCoverage: ''
    };

    this.handleSubmit(data);
  }

  handleSubmit = (data) => {
    this.setState({
      isEditing: false
    });
    this.props.onSubmit(data);
  }


  render() {
    let { pristine, isPending } = this.props;
    let { intl } = this.context;

    const { beginCoverage, endCoverage } = this.props.initialValues;
    if (this.state.isEditing) {
      return (
        <form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
          <div
            data-test-eholdings-package-details-custom-coverage-inputs
            className={styles['custom-coverage-form-editing']}
          >
            <div className={styles['custom-coverage-dates']}>
              <div data-test-eholdings-package-details-custom-begin-coverage className={styles['custom-coverage-date-picker']}>
                <Field
                  name='beginCoverage'
                  component={this.renderDatepicker}
                  label="Start Date"
                />
              </div>
              <div data-test-eholdings-package-details-custom-end-coverage className={styles['custom-coverage-date-picker']}>
                <Field
                  name='endCoverage'
                  component={this.renderDatepicker}
                  label="End Date"
                />
              </div>
              <div className={styles['custom-coverage-date-clear-row']}>
                {this.props.initialValues.beginCoverage && (
                  <IconButton icon="trashBin" onClick={this.handleDeleteCustomCoverage} size="small" />
                )}
              </div>
            </div>
            <div className={styles['custom-coverage-action-buttons']}>
              <div data-test-eholdings-package-details-cancel-custom-coverage-button>
                <Button disabled={isPending} type="button" role="button" buttonStyle="secondary" onClick={this.handleCancelCustomCoverage}>
                  Cancel
                </Button>
              </div>
              <div data-test-eholdings-package-details-save-custom-coverage-button>
                <Button disabled={pristine} type="submit" role="button">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      );
    } else if (beginCoverage) {
      return (
        <div className={styles['custom-coverage-form']}>
          <div className={styles['custom-coverage-date-display']}>
            <div data-test-eholdings-package-details-custom-coverage-display className={styles['custom-coverage-dates']}>
              {formatISODateWithoutTime(beginCoverage, intl)} - {formatISODateWithoutTime(endCoverage, intl) || 'Present'}
            </div>
            <div data-test-eholdings-package-details-edit-custom-coverage-button>
              <IconButton icon="edit" onClick={this.handleEditCustomCoverage} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles['custom-coverage-form']}>
          <div data-test-eholdings-package-details-custom-coverage-button>
            <Button
              type="button"
              onClick={this.handleEditCustomCoverage}
            >
              Add Custom Coverage
            </Button>
          </div>
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

  if (!values.beginCoverage || !moment(values.beginCoverage).isValid()) {
    errors.beginCoverage = `Enter Date in ${dateFormat} format.`;
  }

  if (values.endCoverage && moment(values.beginCoverage).isAfter(moment(values.endCoverage))) {
    errors.beginCoverage = 'Start Date must be before End Date';
  }

  return errors;
}

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'CustomCoverage',
  destroyOnUnmount: false
})(CustomCoverageDate);

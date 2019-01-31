import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
  IconButton,
  Select,
  TextField
} from '@folio/stripes/components';
import styles from './custom-embargo-fields.css';

function validateEmbargoValue(value) {
  let error;
  const customEmbargoValueIsDecimal = Number(value) % 1 !== 0
    || (value && value.toString().indexOf('.') !== -1);

  if (value <= 0) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.embargoPeriod.moreThanZero" />;
  }

  if (customEmbargoValueIsDecimal) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.embargoPeriod.decimal" />;
  }

  if (Number.isNaN(Number(value))) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.embargoPeriod.number" />;
  }

  return error;
}

function validateEmbargoUnit(value, { customEmbargoValue }) {
  let error;

  if (customEmbargoValue > 0 && !value) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.embargoPeriod.unit" />;
  }

  return error;
}

export default class CustomEmbargoFields extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    initial: PropTypes.object,
    showInputs: PropTypes.bool
  };

  static defaultProps = {
    initial: []
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
    let { initial } = this.props;
    let { showInputs } = this.state;

    return (showInputs) ? (
      <div className={styles['custom-embargo-fields']}>
        <div
          data-test-eholdings-custom-embargo-textfield
          className={styles['custom-embargo-text-field']}
        >
          <FormattedMessage id="ui-eholdings.number">
            {placeholder => (
              <Field
                name="customEmbargoValue"
                component={TextField}
                placeholder={placeholder}
                autoFocus={initial.customEmbargoValue === 0}
                validate={validateEmbargoValue}
              />
            )}
          </FormattedMessage>
        </div>

        <div
          data-test-eholdings-custom-embargo-select
          className={styles['custom-embargo-select']}
        >
          <Field
            name="customEmbargoUnit"
            component={Select}
            validate={validateEmbargoUnit}
          >
            <FormattedMessage id="ui-eholdings.label.selectTimePeriod">
              {(message) => <option value="">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.days">
              {(message) => <option value="Days">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.weeks">
              {(message) => <option value="Weeks">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.months">
              {(message) => <option value="Months">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.years">
              {(message) => <option value="Years">{message}</option>}
            </FormattedMessage>
          </Field>
        </div>

        <div
          data-test-eholdings-custom-embargo-remove-row-button
          className={styles['custom-embargo-clear-row']}
        >
          <FormattedMessage id="ui-eholdings.resource.embargoPeriod.clear">
            {ariaLabel => (
              <IconButton
                icon="trash"
                onClick={this.clearValues}
                size="small"
                ariaLabel={ariaLabel}
              />
            )}
          </FormattedMessage>
        </div>
      </div>
    ) : (
      <div>
        {initial.customEmbargoValue !== 0 && (
          <p data-test-eholdings-embargo-fields-saving-will-remove>
            <FormattedMessage id="ui-eholdings.resource.embargoPeriod.saveWillRemove" />
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
            <Icon icon="plus-sign">
              <FormattedMessage id="ui-eholdings.resource.embargoPeriod.addCustom" />
            </Icon>
          </Button>
        </div>
      </div>
    );
  }
}

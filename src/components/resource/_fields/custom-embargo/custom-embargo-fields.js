import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';

import {
  Button,
  IconButton,
  Select,
  TextField
} from '@folio/stripes-components';
import styles from './custom-embargo-fields.css';

class CustomEmbargoFields extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    showInputs: PropTypes.bool,
    initialValue: PropTypes.object,
    intl: intlShape.isRequired
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
    let { initialValue, intl } = this.props;
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
            placeholder={intl.formatMessage({ id: 'ui-eholdings.number' })}
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
              { value: '', label: intl.formatMessage({ id: 'ui-eholdings.label.selectTimePeriod' }) },
              { value: 'Days', label: intl.formatMessage({ id: 'ui-eholdings.label.days' }) },
              { value: 'Weeks', label: intl.formatMessage({ id: 'ui-eholdings.label.weeks' }) },
              { value: 'Months', label: intl.formatMessage({ id: 'ui-eholdings.label.months' }) },
              { value: 'Years', label: intl.formatMessage({ id: 'ui-eholdings.label.years' }) }
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
            ariaLabel={intl.formatMessage({ id: 'ui-eholdings.resource.embargoPeriod.clear' })}
          />
        </div>
      </div>
    ) : (
      <div>
        {initialValue.customEmbargoValue !== 0 && (
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
            <FormattedMessage id="ui-eholdings.resource.embargoPeriod.addCustom" />
          </Button>
        </div>
      </div>
    );
  }
}

export default injectIntl(CustomEmbargoFields);

export function validate(values, { intl }) {
  const errors = {};


  if (Number.isNaN(Number(values.customEmbargoValue))) {
    errors.customEmbargoValue = intl.formatMessage({ id: 'ui-eholdings.validate.errors.embargoPeriod.number' });
  }

  if (values.customEmbargoValue <= 0) {
    errors.customEmbargoValue = intl.formatMessage({ id: 'ui-eholdings.validate.errors.embargoPeriod.moreThanZero' });
  }

  if (values.customEmbargoValue > 0 && !values.customEmbargoUnit) {
    errors.customEmbargoUnit = intl.formatMessage({ id: 'ui-eholdings.validate.errors.embargoPeriod.unit' });
  }
  return errors;
}

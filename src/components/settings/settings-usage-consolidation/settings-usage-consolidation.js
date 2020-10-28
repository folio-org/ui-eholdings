import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Field,
} from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import moment from 'moment';

import {
  TextField,
  Select,
} from '@folio/stripes/components';

import SettingsForm from '../settings-form';

const propTypes = {
  clearUsageConsolidationErrors: PropTypes.func.isRequired,
  updateUsageConsolidation: PropTypes.func.isRequired,
  usageConsolidation: PropTypes.shape({
    data: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
};

const INVALID_CUSTOMER_KEY_ERROR_MESSAGE = 'Invalid UC Credentials';

const SettingsUsageConsolidation = ({
  clearUsageConsolidationErrors,
  usageConsolidation,
  updateUsageConsolidation: onSubmit,
}) => {
  const { formatMessage } = useIntl();

  const usageConsolidationIdLabel = formatMessage({ id: 'ui-eholdings.settings.usageConsolidation.id' });
  const usageConsolidationStartMonthLabel = formatMessage({ id: 'ui-eholdings.settings.usageConsolidation.startMonth' });

  const customerKeyIsInvalid = usageConsolidation.errors[0]?.title === INVALID_CUSTOMER_KEY_ERROR_MESSAGE;

  const validate = values => {
    const errors = {};

    if (customerKeyIsInvalid) {
      errors.customerKey = (
        <FormattedMessage id="ui-eholdings.settings.usageConsolidation.id.validation.invalid" />
      );
    }

    if (!values.customerKey) {
      errors.customerKey = (
        <FormattedMessage id="ui-eholdings.settings.usageConsolidation.id.validation.empty" />
      );
    }

    return errors;
  };

  const monthDataOptions = moment.months().map(month => ({
    value: month.toLowerCase().substr(0, 3),
    label: month,
  }));

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={usageConsolidation.data}
      validate={validate}
      render={formState => (
        <SettingsForm
          data-test-eholdings-settings-usage-consolidation
          id="usage-consolidation-form"
          formState={formState}
          title={<FormattedMessage id="ui-eholdings.settings.usageConsolidation" />}
          toasts={[]}
        >
          <Field
            id="eholdings-settings-usage-consolidation-id"
            name="customerKey"
            type="password"
            autoComplete="off"
            required
            component={TextField}
            label={usageConsolidationIdLabel}
            aria-label={usageConsolidationIdLabel}
            parse={value => {
              if (customerKeyIsInvalid) {
                clearUsageConsolidationErrors();
              }

              return value;
            }}
          />
          <Field
            id="eholdings-settings-usage-consolidation-month"
            name="startMonth"
            component={Select}
            dataOptions={monthDataOptions}
            label={usageConsolidationStartMonthLabel}
            aria-label={usageConsolidationStartMonthLabel}
          />
        </SettingsForm>
      )}
    />
  );
};

SettingsUsageConsolidation.propTypes = propTypes;

export default SettingsUsageConsolidation;

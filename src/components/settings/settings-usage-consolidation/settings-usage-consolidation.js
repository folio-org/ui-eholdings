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
import {
  platformTypes,
  usageConsolidation as ucReduxStateShape,
} from '../../../constants';

const propTypes = {
  clearUsageConsolidationErrors: PropTypes.func.isRequired,
  currencies: PropTypes.shape({
    errors: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
  }),
  updateUsageConsolidation: PropTypes.func.isRequired,
  usageConsolidation: ucReduxStateShape.UsageConsolidationReduxStateShape.isRequired,
};

const INVALID_CUSTOMER_KEY_ERROR_MESSAGE = 'Invalid UC Credentials';

const SettingsUsageConsolidation = ({
  clearUsageConsolidationErrors,
  currencies,
  usageConsolidation,
  updateUsageConsolidation: onSubmit,
}) => {
  const { formatMessage } = useIntl();

  const usageConsolidationIdLabel = formatMessage({ id: 'ui-eholdings.settings.usageConsolidation.id' });
  const usageConsolidationStartMonthLabel = formatMessage({ id: 'ui-eholdings.settings.usageConsolidation.startMonth' });
  const currencyLabel = formatMessage({ id: 'ui-eholdings.settings.usageConsolidation.currency' });
  const usageConsolidationPlatformTypeLabel = formatMessage({ id: 'ui-eholdings.settings.usageConsolidation.platformType' });

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

    if (!values.currency) {
      errors.currency = (
        <FormattedMessage id="ui-eholdings.settings.usageConsolidation.currency.validation" />
      );
    }

    return errors;
  };

  const monthDataOptions = moment.months().map(month => ({
    value: month.toLowerCase().substr(0, 3),
    label: month,
  }));

  const parseUsageConsolidationId = value => {
    if (customerKeyIsInvalid) {
      clearUsageConsolidationErrors();
    }

    return value;
  };

  const defaultCurrency = {
    value: '',
    label: formatMessage({ id: 'ui-eholdings.settings.usageConsolidation.currency.default' }),
  };

  const currencyDataOptions = currencies.items.map(({ attributes: {
    code,
    description,
  } }) => ({
    value: code,
    label: description,
  }));

  const platformTypesDataOptions = Object.values(platformTypes).map(platformType => ({
    label: formatMessage({ id: `ui-eholdings.settings.usageConsolidation.platformType.${platformType}` }),
    value: platformType,
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
            autoComplete="new-password"
            required
            component={TextField}
            label={usageConsolidationIdLabel}
            aria-label={usageConsolidationIdLabel}
            parse={parseUsageConsolidationId}
          />
          <Field
            id="eholdings-settings-usage-consolidation-month"
            name="startMonth"
            component={Select}
            dataOptions={monthDataOptions}
            label={usageConsolidationStartMonthLabel}
          />
          <Field
            id="eholdings-settings-usage-consolidation-platform-type"
            name="platformType"
            component={Select}
            dataOptions={platformTypesDataOptions}
            label={usageConsolidationPlatformTypeLabel}
          />
          <Field
            id="eholdings-settings-usage-consolidation-currency"
            name="currency"
            component={Select}
            dataOptions={[defaultCurrency, ...currencyDataOptions]}
            label={currencyLabel}
            required
          />
        </SettingsForm>
      )}
    />
  );
};

SettingsUsageConsolidation.propTypes = propTypes;

export default SettingsUsageConsolidation;

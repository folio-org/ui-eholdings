import React, {
  useEffect,
  useState,
} from 'react';
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
  useStripes,
} from '@folio/stripes/core';
import {
  Select,
} from '@folio/stripes/components';

import SettingsForm from '../settings-form';
import ShowHidePasswordField from '../../show-hide-password-field';
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
  const [toasts, setToasts] = useState([]);
  const stripes = useStripes();
  const disabled = !stripes.hasPerm('ui-eholdings.settings.usage-consolidation.create-edit');
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (usageConsolidation.hasSaved) {
      setToasts(t => [...t, {
        id: `settings-uc-${Date.now()}`,
        message: <FormattedMessage id="ui-eholdings.settings.usageConsolidation.saved" />,
        type: 'success',
      }]);
    }
  }, [usageConsolidation.hasSaved]);

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
          toasts={toasts}
        >
          <ShowHidePasswordField
            id="eholdings-settings-usage-consolidation-id"
            name="customerKey"
            required
            label={usageConsolidationIdLabel}
            aria-label={usageConsolidationIdLabel}
            parse={parseUsageConsolidationId}
            disabled={disabled}
            showButtonLabel={<FormattedMessage id="ui-eholdings.settings.usageConsolidation.id.show" />}
            hideButtonLabel={<FormattedMessage id="ui-eholdings.settings.usageConsolidation.id.hide" />}
            showButton={usageConsolidation.isKeyLoaded}
          />
          <Field
            id="eholdings-settings-usage-consolidation-month"
            name="startMonth"
            component={Select}
            dataOptions={monthDataOptions}
            label={usageConsolidationStartMonthLabel}
            disabled={disabled}
          />
          <Field
            id="eholdings-settings-usage-consolidation-platform-type"
            name="platformType"
            component={Select}
            dataOptions={platformTypesDataOptions}
            label={usageConsolidationPlatformTypeLabel}
            disabled={disabled}
          />
          <Field
            id="eholdings-settings-usage-consolidation-currency"
            name="currency"
            component={Select}
            dataOptions={[defaultCurrency, ...currencyDataOptions]}
            label={currencyLabel}
            required
            disabled={disabled}
          />
        </SettingsForm>
      )}
    />
  );
};

SettingsUsageConsolidation.propTypes = propTypes;

export default SettingsUsageConsolidation;

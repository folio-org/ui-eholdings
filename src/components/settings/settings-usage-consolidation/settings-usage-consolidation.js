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

import {
  TextField,
} from '@folio/stripes/components';

import SettingsForm from '../settings-form';

const propTypes = {
  clearUsageConsolidationErrors: PropTypes.func.isRequired,
  updateUsageConsolidation: PropTypes.func.isRequired,
  usageConsolidation: PropTypes.shape({
    errors: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
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
  }

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
            onChange={() => {
              if (customerKeyIsInvalid) {
                clearUsageConsolidationErrors();
              }
            }}
          />
        </SettingsForm>
      )}
    />
  );
};

SettingsUsageConsolidation.propTypes = propTypes;

export default SettingsUsageConsolidation;

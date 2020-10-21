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
  updateUsageConsolidation: PropTypes.func.isRequired,
};

const SettingsUsageConsolidation = ({
  usageConsolidation,
  updateUsageConsolidation,
}) => {
  const { formatMessage } = useIntl();

  const usageConsolidationIdLabel = formatMessage({ id: 'ui-eholdings.settings.usageConsolidation.id' });

  const onSubmit = params => {
    updateUsageConsolidation(params);
  };

  const validate = values => {
    const errors = {};

    if (!values.customerKey) {
      errors.customerKey = (
        <FormattedMessage id="ui-eholdings.settings.usageConsolidation.id.validation.empty" />
      );
    }

    if (usageConsolidation.errors.title === 'Invalid UC Credentials') {
      errors.customerKey = (
        <FormattedMessage id="ui-eholdings.settings.usageConsolidation.id.validation.invalid" />
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
          />
        </SettingsForm>
      )}
    />
  );
};

SettingsUsageConsolidation.propTypes = propTypes;

export default SettingsUsageConsolidation;

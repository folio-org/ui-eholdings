import {
  useEffect,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  useStripes,
} from '@folio/stripes/core';
import {
  Icon,
} from '@folio/stripes/components';

import View from '../components/settings/settings-usage-consolidation';

import { selectPropFromData } from '../redux/selectors';
import {
  clearUsageConsolidationErrors as clearUsageConsolidationErrorsAction,
  getUsageConsolidation as getUsageConsolidationAction,
  getUcCredentialsClientId as getUcCredentialsClientIdAction,
  getUcCredentialsClientSecret as getUcCredentialsClientSecretAction,
  getUsageConsolidationKey as getUsageConsolidationKeyAction,
  patchUsageConsolidation as patchUsageConsolidationAction,
  postUsageConsolidation as postUsageConsolidationAction,
  getCurrencies as getCurrenciesAction,
  getUcCredentials as getUcCredentialsAction,
  updateUcCredentials as updateUcCredentialsAction,
} from '../redux/actions';
import {
  usageConsolidation as ucReduxStateShape,
  ucCredentialsReduxStateShape,
} from '../constants';

const propTypes = {
  clearUsageConsolidationErrors: PropTypes.func.isRequired,
  currencies: PropTypes.shape({
    errors: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
  }),
  getCurrencies: PropTypes.func.isRequired,
  getUcCredentials: PropTypes.func.isRequired,
  getUcCredentialsClientId: PropTypes.func.isRequired,
  getUcCredentialsClientSecret: PropTypes.func.isRequired,
  getUsageConsolidation: PropTypes.func.isRequired,
  getUsageConsolidationKey: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      kbId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  patchUsageConsolidation: PropTypes.func.isRequired,
  postUsageConsolidation: PropTypes.func.isRequired,
  ucCredentials: ucCredentialsReduxStateShape,
  updateUcCredentials: PropTypes.func.isRequired,
  usageConsolidation: ucReduxStateShape.UsageConsolidationReduxStateShape.isRequired,
};

const SettingsUsageConsolidationRoute = ({
  clearUsageConsolidationErrors,
  currencies,
  getCurrencies,
  getUcCredentials,
  getUsageConsolidation,
  getUcCredentialsClientId,
  getUcCredentialsClientSecret,
  getUsageConsolidationKey,
  match: { params: { kbId } },
  patchUsageConsolidation,
  postUsageConsolidation,
  ucCredentials,
  updateUcCredentials,
  usageConsolidation,
  history,
}) => {
  const [formData, setFormData] = useState({});
  const stripes = useStripes();
  const {
    data: usageConsolidationData,
    isLoading,
    isLoaded,
  } = usageConsolidation;

  if (!stripes.hasPerm('ui-eholdings.settings.usage-consolidation.view')) {
    history.push('/settings/eholdings');
  }

  useEffect(() => {
    getUsageConsolidation(kbId);
  }, [getUsageConsolidation, kbId]);

  useEffect(() => {
    if (isLoaded) {
      getUsageConsolidationKey(kbId);
    }
  }, [getUsageConsolidationKey, kbId, isLoaded]);

  useEffect(() => {
    getUcCredentialsClientId();
  }, [getUcCredentialsClientId]);

  useEffect(() => {
    getUcCredentialsClientSecret();
  }, [getUcCredentialsClientSecret]);

  useEffect(() => {
    getCurrencies();
  }, [getCurrencies]);

  useEffect(() => {
    getUcCredentials();
  }, [getUcCredentials]);

  const updateUsageConsolidation = useCallback(params => {
    const {
      credentialsId,
      ...updatedData
    } = params;

    const attributes = {
      currency: updatedData.currency,
      platformType: updatedData.platformType,
      startMonth: updatedData.startMonth,
    };

    if (usageConsolidationData.customerKey !== updatedData.customerKey) {
      attributes.customerKey = updatedData.customerKey;
    }

    const data = {
      type: 'ucSettings',
      attributes,
    };

    if (!usageConsolidationData?.credentialsId) {
      postUsageConsolidation({ data, credentialsId: kbId });
    } else {
      patchUsageConsolidation({ data, credentialsId });
    }
  }, [
    usageConsolidation.data.credentialsId,
    usageConsolidation.credentialsId,
    usageConsolidation.customerKey,
    kbId,
    postUsageConsolidation,
    patchUsageConsolidation,
  ]);

  useEffect(() => {
    if (ucCredentials.isUpdated && ucCredentials.isPresent) {
      updateUsageConsolidation(formData);
    }
  }, [ucCredentials, formData, updateUsageConsolidation]);

  const onSubmit = (params, form) => {
    const {
      clientId,
      clientSecret,
    } = params;
    const { modified } = form.getState();

    if (modified.clientId || modified.clientSecret) {
      updateUcCredentials({
        type: 'ucCredentials',
        attributes: {
          clientId,
          clientSecret,
        },
      });

      setFormData(params);
    } else {
      updateUsageConsolidation(params);
    }
  };

  return isLoading
    ? <Icon icon="spinner-ellipsis" />
    : (
      <View
        ucCredentials={ucCredentials}
        usageConsolidation={usageConsolidation}
        onSubmit={onSubmit}
        clearUsageConsolidationErrors={clearUsageConsolidationErrors}
        currencies={currencies}
      />
    );
};

SettingsUsageConsolidationRoute.propTypes = propTypes;

export default connect(
  store => ({
    usageConsolidation: selectPropFromData(store, 'usageConsolidation'),
    currencies: selectPropFromData(store, 'currencies'),
    ucCredentials: selectPropFromData(store, 'ucCredentials'),
  }), {
    clearUsageConsolidationErrors: clearUsageConsolidationErrorsAction,
    getUsageConsolidation: getUsageConsolidationAction,
    getUsageConsolidationKey: getUsageConsolidationKeyAction,
    patchUsageConsolidation: patchUsageConsolidationAction,
    postUsageConsolidation: postUsageConsolidationAction,
    getCurrencies: getCurrenciesAction,
    getUcCredentialsClientId: getUcCredentialsClientIdAction,
    getUcCredentialsClientSecret: getUcCredentialsClientSecretAction,
    getUcCredentials: getUcCredentialsAction,
    updateUcCredentials: updateUcCredentialsAction,
  }
)(withRouter(SettingsUsageConsolidationRoute));

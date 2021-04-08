import { useEffect } from 'react';
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
  getUsageConsolidationKey as getUsageConsolidationKeyAction,
  patchUsageConsolidation as patchUsageConsolidationAction,
  postUsageConsolidation as postUsageConsolidationAction,
  getCurrencies as getCurrenciesAction,
} from '../redux/actions';
import { usageConsolidation as ucReduxStateShape } from '../constants';

const propTypes = {
  clearUsageConsolidationErrors: PropTypes.func.isRequired,
  currencies: PropTypes.shape({
    errors: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
  }),
  getCurrencies: PropTypes.func.isRequired,
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
  usageConsolidation: ucReduxStateShape.UsageConsolidationReduxStateShape.isRequired,
};

const SettingsUsageConsolidationRoute = ({
  clearUsageConsolidationErrors,
  currencies,
  getCurrencies,
  getUsageConsolidation,
  getUsageConsolidationKey,
  match: { params: { kbId } },
  patchUsageConsolidation,
  postUsageConsolidation,
  usageConsolidation,
  history,
}) => {
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
    getCurrencies();
  }, [getCurrencies]);

  const updateUsageConsolidation = params => {
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
  };

  return isLoading
    ? <Icon icon='spinner-ellipsis' />
    : (
      <View
        usageConsolidation={usageConsolidation}
        updateUsageConsolidation={updateUsageConsolidation}
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
  }), {
    clearUsageConsolidationErrors: clearUsageConsolidationErrorsAction,
    getUsageConsolidation: getUsageConsolidationAction,
    getUsageConsolidationKey: getUsageConsolidationKeyAction,
    patchUsageConsolidation: patchUsageConsolidationAction,
    postUsageConsolidation: postUsageConsolidationAction,
    getCurrencies: getCurrenciesAction,
  }
)(withRouter(SettingsUsageConsolidationRoute));

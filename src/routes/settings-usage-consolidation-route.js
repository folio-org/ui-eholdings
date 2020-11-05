import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Icon,
} from '@folio/stripes/components';

import View from '../components/settings/settings-usage-consolidation';

import { selectPropFromData } from '../redux/selectors';
import {
  clearUsageConsolidationErrors as clearUsageConsolidationErrorsAction,
  getUsageConsolidation as getUsageConsolidationAction,
  patchUsageConsolidation as patchUsageConsolidationAction,
  postUsageConsolidation as postUsageConsolidationAction,
  getCurrencies as getCurrenciesAction,
} from '../redux/actions';

const propTypes = {
  clearUsageConsolidationErrors: PropTypes.func.isRequired,
  currencies: PropTypes.shape({
    errors: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
  }),
  getCurrencies: PropTypes.func.isRequired,
  getUsageConsolidation: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      kbId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  patchUsageConsolidation: PropTypes.func.isRequired,
  postUsageConsolidation: PropTypes.func.isRequired,
  usageConsolidation: PropTypes.shape({
    data: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }),
};

const SettingsUsageConsolidationRoute = ({
  clearUsageConsolidationErrors,
  currencies,
  getCurrencies,
  getUsageConsolidation,
  match: { params: { kbId } },
  patchUsageConsolidation,
  postUsageConsolidation,
  usageConsolidation,
}) => {
  const {
    data: usageConsolidationData,
    isLoading,
  } = usageConsolidation;

  useEffect(() => {
    getUsageConsolidation(kbId);
  }, [getUsageConsolidation, kbId]);

  useEffect(() => {
    getCurrencies();
  }, [getCurrencies]);

  const updateUsageConsolidation = params => {
    const {
      credentialsId,
      ...updatedData
    } = params;

    const attributes = {
      currency: 'USD',
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
    patchUsageConsolidation: patchUsageConsolidationAction,
    postUsageConsolidation: postUsageConsolidationAction,
    getCurrencies: getCurrenciesAction,
  }
)(SettingsUsageConsolidationRoute);

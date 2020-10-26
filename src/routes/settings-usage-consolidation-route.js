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
} from '../redux/actions';

const propTypes = {
  clearUsageConsolidationErrors: PropTypes.func.isRequired,
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

  const updateUsageConsolidation = params => {
    const data = {
      type: 'ucSettings',
      attributes: {
        ...params,
        currency: 'USD',
      },
    };

    if (!usageConsolidationData?.id) {
      postUsageConsolidation({ data, credentialsId: kbId });
    } else {
      patchUsageConsolidation({ data, credentialsId: kbId });
    }
  };

  return isLoading
    ? <Icon icon='spinner-ellipsis' />
    : (
      <View
        usageConsolidation={usageConsolidation}
        updateUsageConsolidation={updateUsageConsolidation}
        clearUsageConsolidationErrors={clearUsageConsolidationErrors}
      />
    );
};

SettingsUsageConsolidationRoute.propTypes = propTypes;

export default connect(
  store => ({
    usageConsolidation: selectPropFromData(store, 'usageConsolidation'),
  }), {
    clearUsageConsolidationErrors: clearUsageConsolidationErrorsAction,
    getUsageConsolidation: getUsageConsolidationAction,
    patchUsageConsolidation: patchUsageConsolidationAction,
    postUsageConsolidation: postUsageConsolidationAction,
  }
)(SettingsUsageConsolidationRoute);

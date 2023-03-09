import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';

import View from '../../components/settings/settings-custom-labels';

const propTypes = {
  confirmUpdate: PropTypes.func.isRequired,
  customLabels: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.object.isRequired,
  }).isRequired,
  getCustomLabels: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: PropTypes.object.isRequired,
  updateCustomLabels: PropTypes.func.isRequired,
};

const SettingsCustomLabelsRoute = ({
  getCustomLabels,
  match,
  customLabels,
  updateCustomLabels,
  confirmUpdate,
  history,
}) => {
  const intl = useIntl();
  const stripes = useStripes();

  if (!stripes.hasPerm('kb-ebsco.kb-credentials.custom-labels.collection.get')) {
    history.push('/settings/eholdings');
    return null;
  }

  useEffect(() => {
    getCustomLabels(match.params.kbId);
  }, [getCustomLabels, match.params.kbId]);

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-eholdings.label.settings' })}
      record={intl.formatMessage({ id: 'ui-eholdings.resource.customLabels' })}
    >
      {!customLabels.isLoading ? (
        <View
          customLabels={customLabels}
          updateCustomLabels={updateCustomLabels}
          confirmUpdate={confirmUpdate}
          credentialId={match.params.kbId}
        />
      ) : (
        <Icon
          icon='spinner-ellipsis'
          size='large'
        />
      )}
    </TitleManager>
  );
};

SettingsCustomLabelsRoute.propTypes = propTypes;

export default SettingsCustomLabelsRoute;

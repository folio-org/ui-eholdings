import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';

import View from '../../components/settings/settings-custom-labels';

const propTypes = {
  confirmUpdate: PropTypes.func.isRequired,
  customLabels: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.object.isRequired,
  }).isRequired,
  getCustomLabels: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  updateCustomLabels: PropTypes.func.isRequired,
};

const SettingsCustomLabelsRoute = ({
  getCustomLabels,
  match,
  customLabels,
  updateCustomLabels,
  confirmUpdate,
}) => {
  const intl = useIntl();

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

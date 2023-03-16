import {
  useState,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { cloneDeep } from 'lodash';

import {
  TitleManager,
  CalloutContext,
  useStripes,
} from '@folio/stripes/core';

import View from '../../components/settings/settings-knowledge-base';

import { KbCredentials } from '../../constants';

const propTypes = {
  confirmDeleteKBCredentials: PropTypes.func.isRequired,
  confirmPatchKBCredentials: PropTypes.func.isRequired,
  confirmPostKBCredentials: PropTypes.func.isRequired,
  deleteKBCredentials: PropTypes.func.isRequired,
  getKbCredentialsKey: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  kbCredentials: KbCredentials.KbCredentialsReduxStateShape,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.object.isRequired,
  patchKBCredentials: PropTypes.func.isRequired,
  postKBCredentials: PropTypes.func.isRequired,
};

const SettingsKnowledgeBaseRoute = ({
  confirmDeleteKBCredentials,
  confirmPatchKBCredentials,
  confirmPostKBCredentials,
  deleteKBCredentials,
  getKbCredentialsKey,
  history,
  kbCredentials,
  location,
  match,
  patchKBCredentials,
  postKBCredentials,
}) => {
  const stripes = useStripes();
  const intl = useIntl();
  const callout = useContext(CalloutContext);
  const hasPermToView = stripes.hasPerm('ui-eholdings.settings.kb.view');

  if (!hasPermToView) {
    history.push('/settings/eholdings');
  }

  const getCurrentKBData = () => {
    return kbCredentials.items.find(cred => cred.id === match.params.kbId);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCurrentKBName = () => {
    return getCurrentKBData()?.attributes.name;
  };

  const [isCreateMode, setIsCreateMode] = useState(location.pathname === '/settings/eholdings/knowledge-base/new');
  const [currentKBName, setCurrentKBName] = useState(getCurrentKBName());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadCurrentConfigKey = () => {
    const config = getCurrentKBData();

    if (config && !config.meta.isKeyLoaded && !kbCredentials.isKeyLoading) {
      getKbCredentialsKey(config.id);
    }
  };

  const getCurrentConfig = () => {
    const {
      items,
      hasSaved,
    } = kbCredentials;

    if (isCreateMode) {
      return hasSaved ? items[items.length - 1] : { type: 'kbCredentials', attributes: {} };
    }

    const config = getCurrentKBData();

    return config ? { ...config } : null;
  };

  const updateConfig = ({ url, customerId, apiKey, name }) => {
    const { meta, ...currentConfig } = getCurrentConfig();

    const config = cloneDeep(currentConfig);

    config.attributes = {
      url,
      customerId,
      name,
    };

    if (currentConfig.attributes.apiKey !== apiKey) {
      config.attributes.apiKey = apiKey;
    }

    if (isCreateMode) {
      postKBCredentials({ data: config });
    } else {
      patchKBCredentials(config, config.id);
    }
  };

  const handleDeleteKBCredentials = kbID => {
    setCurrentKBName(getCurrentKBName());
    deleteKBCredentials(kbID);
  };

  useEffect(() => {
    // eslint-disable-next-line react/no-did-update-set-state
    setIsCreateMode(location.pathname === '/settings/eholdings/knowledge-base/new');
    loadCurrentConfigKey();
  }, [location.pathname, loadCurrentConfigKey]);

  useEffect(() => {
    if (kbCredentials.hasLoaded) {
      loadCurrentConfigKey();
    }
  }, [kbCredentials.hasLoaded, loadCurrentConfigKey]);

  useEffect(() => {
    if (kbCredentials.hasUpdated) {
      confirmPatchKBCredentials();
      setCurrentKBName(getCurrentKBName());
    }
  }, [kbCredentials.hasUpdated, confirmPatchKBCredentials, getCurrentKBName]);

  useEffect(() => {
    if (kbCredentials.hasSaved) {
      confirmPostKBCredentials();
      setCurrentKBName(getCurrentKBName());
    }
  }, [kbCredentials.hasSaved, confirmPostKBCredentials, getCurrentKBName]);

  useEffect(() => {
    if (kbCredentials.hasDeleted) {
      history.replace('/settings/eholdings');

      if (callout) {
        callout.sendCallout({
          type: 'success',
          message: (
            <span data-test-kb-deleted-notification>
              <FormattedMessage
                id="ui-eholdings.settings.kb.delete.toast"
                values={{ kbName: currentKBName }}
              />
            </span>
          ),
        });
      }

      confirmDeleteKBCredentials();
    }
  }, [kbCredentials.hasDeleted, confirmDeleteKBCredentials, callout, history, currentKBName]);

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-eholdings.label.settings' })}
      record={intl.formatMessage({ id: 'ui-eholdings.settings.kb' })}
    >
      <View
        kbCredentials={kbCredentials}
        config={getCurrentConfig()}
        onSubmit={updateConfig}
        isCreateMode={isCreateMode}
        onDelete={handleDeleteKBCredentials}
        currentKBName={getCurrentKBName()}
        kbId={match.params.kbId}
      />
    </TitleManager>
  );
};

SettingsKnowledgeBaseRoute.propTypes = propTypes;

export default SettingsKnowledgeBaseRoute;

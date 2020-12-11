import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { cloneDeep } from 'lodash';

import {
  TitleManager,
  CalloutContext,
  withStripes,
} from '@folio/stripes/core';

import {
  postKBCredentials as postKBCredentialsAction,
  patchKBCredentials as patchKBCredentialsAction,
  deleteKBCredentials as deleteKBCredentialsAction,
  confirmPatchKBCredentials as confirmPatchKBCredentialsAction,
  confirmPostKBCredentials as confirmPostKBCredentialsAction,
  confirmDeleteKBCredentials as confirmDeleteKBCredentialsAction,
} from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';
import { KbCredentials } from '../constants';

import View from '../components/settings/settings-knowledge-base';

class SettingsKnowledgeBaseRoute extends Component {
  static propTypes = {
    confirmDeleteKBCredentials: PropTypes.func.isRequired,
    confirmPatchKBCredentials: PropTypes.func.isRequired,
    confirmPostKBCredentials: PropTypes.func.isRequired,
    deleteKBCredentials: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    intl: PropTypes.object.isRequired,
    kbCredentials: KbCredentials.KbCredentialsReduxStateShape,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.object.isRequired,
    patchKBCredentials: PropTypes.func.isRequired,
    postKBCredentials: PropTypes.func.isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    isCreateMode: this.props.location.pathname === '/settings/eholdings/knowledge-base/new',
    currentKBName: this.getCurrentKBName(),
  }


  componentDidUpdate(prevProps) {
    const {
      kbCredentials,
      confirmPatchKBCredentials,
      confirmPostKBCredentials,
      confirmDeleteKBCredentials,
      location: { pathname },
      history,
    } = this.props;

    const { currentKBName } = this.state;

    if (prevProps.location.pathname !== pathname) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isCreateMode: pathname === '/settings/eholdings/knowledge-base/new',
      });
    }

    if (kbCredentials.hasUpdated) {
      confirmPatchKBCredentials();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ currentKBName: this.getCurrentKBName() });
    }

    if (kbCredentials.hasSaved) {
      confirmPostKBCredentials();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ currentKBName: this.getCurrentKBName() });
    }

    if (kbCredentials.hasDeleted) {
      history.replace('/settings/eholdings');

      if (this.sendDeleteSuccessCallout) {
        this.sendDeleteSuccessCallout({
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
  }

  getCurrentKBData() {
    const {
      kbCredentials,
      match,
    } = this.props;

    return kbCredentials.items.find(cred => cred.id === match.params.kbId);
  }

  getCurrentKBName() {
    return this.getCurrentKBData()?.attributes.name;
  }

  getCurrentConfig() {
    const {
      kbCredentials: {
        items,
        hasSaved,
      }
    } = this.props;

    if (this.state.isCreateMode) {
      return hasSaved ? items[items.length - 1] : { type: 'kbCredentials', attributes: {} };
    }

    const config = this.getCurrentKBData();

    return config ? { ...config } : null;
  }

  updateConfig = ({ url, customerId, apiKey, name }) => {
    const {
      postKBCredentials,
      patchKBCredentials
    } = this.props;

    const { meta, ...currentConfig } = this.getCurrentConfig();

    const config = cloneDeep(currentConfig);
    config.attributes = {
      url,
      customerId,
      name,
    };

    if (currentConfig.attributes.apiKey !== apiKey) {
      config.attributes.apiKey = apiKey;
    }

    if (this.state.isCreateMode) {
      postKBCredentials({ data: config });
    } else {
      patchKBCredentials(config, config.id);
    }
  };

  deleteKBCredentials = kbID => {
    this.setState({
      currentKBName: this.getCurrentKBName(),
    });
    this.props.deleteKBCredentials(kbID);
  };

  render() {
    const {
      kbCredentials,
      intl,
      stripes,
      history,
    } = this.props;

    if (!stripes.hasPerm('ui-eholdings.settings.kb')) {
      history.push('/settings/eholdings');
    }

    return (
      <CalloutContext.Consumer>
        {(context) => {
          if (context) {
            this.sendDeleteSuccessCallout = context.sendCallout;
          }

          return (
            <TitleManager
              page={intl.formatMessage({ id: 'ui-eholdings.label.settings' })}
              record={intl.formatMessage({ id: 'ui-eholdings.settings.kb' })}
            >
              <View
                kbCredentials={kbCredentials}
                config={this.getCurrentConfig()}
                onSubmit={this.updateConfig}
                isCreateMode={this.state.isCreateMode}
                onDelete={this.deleteKBCredentials}
                currentKBName={this.getCurrentKBName()}
              />
            </TitleManager>
          );
        }}
      </CalloutContext.Consumer>
    );
  }
}

export default connect(
  (store) => ({
    kbCredentials: selectPropFromData(store, 'kbCredentials'),
  }),
  {
    postKBCredentials: postKBCredentialsAction,
    patchKBCredentials: patchKBCredentialsAction,
    deleteKBCredentials: deleteKBCredentialsAction,
    confirmDeleteKBCredentials: confirmDeleteKBCredentialsAction,
    confirmPatchKBCredentials: confirmPatchKBCredentialsAction,
    confirmPostKBCredentials: confirmPostKBCredentialsAction,
  }
)(injectIntl(withStripes(SettingsKnowledgeBaseRoute)));

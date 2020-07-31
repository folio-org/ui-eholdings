import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactRouterPropTypes from 'react-router-prop-types';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import { cloneDeep } from 'lodash';

import {
  postKBCredentials as postKBCredentialsAction,
  patchKBCredentials as patchKBCredentialsAction,
  confirmPatchKBCredentials as confirmPatchKBCredentialsAction,
  confirmPostKBCredentials as confirmPostKBCredentialsAction,
} from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';
import { KbCredentials } from '../constants';

import View from '../components/settings/settings-knowledge-base';

class SettingsKnowledgeBaseRoute extends Component {
  static propTypes = {
    confirmPatchKBCredentials: PropTypes.func.isRequired,
    confirmPostKBCredentials: PropTypes.func.isRequired,
    kbCredentials: KbCredentials.KbCredentialsReduxStateShape,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.object.isRequired,
    patchKBCredentials: PropTypes.func.isRequired,
    postKBCredentials: PropTypes.func.isRequired,
  };

  state = {
    isCreateMode: this.props.location.pathname === '/settings/eholdings/knowledge-base/new',
  }

  componentDidUpdate(prevProps) {
    const {
      kbCredentials,
      confirmPatchKBCredentials,
      confirmPostKBCredentials,
      location: { pathname }
    } = this.props;

    if (prevProps.location.pathname !== pathname) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isCreateMode: pathname === '/settings/eholdings/knowledge-base/new',
      });
    }

    if (kbCredentials.hasUpdated) {
      confirmPatchKBCredentials();
    }

    if (kbCredentials.hasSaved) {
      confirmPostKBCredentials();
    }
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

    const config = items.find(cred => cred.id === this.props.match.params.kbId);

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

  render() {
    const { kbCredentials } = this.props;

    return (
      <FormattedMessage id="ui-eholdings.label.settings">
        {pageLabel => (
          <FormattedMessage id="ui-eholdings.settings.kb">
            {recordLabel => (
              <TitleManager
                page={pageLabel}
                record={recordLabel}
              >
                <View
                  kbCredentials={kbCredentials}
                  config={this.getCurrentConfig()}
                  onSubmit={this.updateConfig}
                  isCreateMode={this.state.isCreateMode}
                />
              </TitleManager>
            )}
          </FormattedMessage>
        )}
      </FormattedMessage>
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
    confirmPatchKBCredentials: confirmPatchKBCredentialsAction,
    confirmPostKBCredentials: confirmPostKBCredentialsAction,
  }
)(SettingsKnowledgeBaseRoute);

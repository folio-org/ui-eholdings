import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';

import { putKBCredentials, confirmPutKBCredentials } from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';
import { KbCredentials } from '../constants';

import View from '../components/settings/settings-knowledge-base';

class SettingsKnowledgeBaseRoute extends Component {
  static propTypes = {
    confirmPutKBCredentials: PropTypes.func.isRequired,
    getBackendConfig: PropTypes.func.isRequired,
    kbCredentials: KbCredentials.KbCredentialsReduxStateShape,
    match: PropTypes.object.isRequired,
    putKBCredentials: PropTypes.func.isRequired,
  };

  componentDidUpdate() {
    const { kbCredentials, confirmPutKBCredentials } = this.props;

    if (kbCredentials.hasUpdated) {
      confirmPutKBCredentials();
    }
  }

  getCurrentConfig() {
    return this.props.kbCredentials.items.find(cred => cred.id === this.props.match.params.kbId);
  }

  updateConfig = ({ rmapiBaseUrl, customerId, apiKey, name }) => {
    const { putKBCredentials } = this.props;
    const config = this.getCurrentConfig();

    config.attributes.url = rmapiBaseUrl;
    config.attributes.customerId = customerId;
    config.attributes.apiKey = apiKey;
    config.attributes.name = name;

    putKBCredentials(config);
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
  }), {
    putKBCredentials,
    confirmPutKBCredentials,
  }
)(SettingsKnowledgeBaseRoute);

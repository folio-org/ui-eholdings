import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactRouterPropTypes from 'react-router-prop-types';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';

import {
  postKBCredentials as postKBCredentialsAction,
  putKBCredentials as putKBCredentialsAction,
  confirmPutKBCredentials as confirmPutKBCredentialsAction,
  confirmPostKBCredentials as confirmPostKBCredentialsAction,
} from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';
import { KbCredentials } from '../constants';

import View from '../components/settings/settings-knowledge-base';

class SettingsKnowledgeBaseRoute extends Component {
  static propTypes = {
    confirmPostKBCredentials: PropTypes.func.isRequired,
    confirmPutKBCredentials: PropTypes.func.isRequired,
    kbCredentials: KbCredentials.KbCredentialsReduxStateShape,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.object.isRequired,
    postKBCredentials: PropTypes.func.isRequired,
    putKBCredentials: PropTypes.func.isRequired,
  };

  state = {
    isCreateMode: this.props.location.pathname === '/settings/eholdings/knowledge-base/new',
  }

  componentDidUpdate(prevProps) {
    const {
      kbCredentials,
      confirmPutKBCredentials,
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
      confirmPutKBCredentials();
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

    return items.find(cred => cred.id === this.props.match.params.kbId);
  }

  updateConfig = ({ rmapiBaseUrl, customerId, apiKey, name }) => {
    const {
      postKBCredentials,
      putKBCredentials
    } = this.props;

    const config = this.getCurrentConfig();

    config.attributes.url = rmapiBaseUrl;
    config.attributes.customerId = customerId;
    config.attributes.apiKey = apiKey;
    config.attributes.name = name;

    if (this.state.isCreateMode) {
      postKBCredentials({ data: config });
    } else {
      putKBCredentials({ data: config }, config.id);
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
  }), {
    postKBCredentials: postKBCredentialsAction,
    putKBCredentials: putKBCredentialsAction,
    confirmPutKBCredentials: confirmPutKBCredentialsAction,
    confirmPostKBCredentials: confirmPostKBCredentialsAction,
  }
)(SettingsKnowledgeBaseRoute);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import { isEqual } from 'lodash';
import {
  postKBCredentials as postKBCredentialsAction,
  confirmPutKBCredentials as confirmPutKBCredentialsAction,
} from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';
import { KbCredentials } from '../constants';

import View from '../components/settings/settings-knowledge-base';

class SettingsKnowledgeBaseRoute extends Component {
  static propTypes = {
    confirmPutKBCredentials: PropTypes.func.isRequired,
    kbCredentials: KbCredentials.KbCredentialsReduxStateShape,
    postKBCredentials: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { kbCredentials, confirmPutKBCredentials } = this.props;
    console.log('kb', kbCredentials);

    if (!isEqual(prevProps.kbCredentials.items, kbCredentials.items)) {
      confirmPutKBCredentials();
    }

    if (kbCredentials.hasUpdated) {
      confirmPutKBCredentials();
    }
  }

  createConfig = ({ rmapiBaseUrl, customerId, apiKey, name }) => {
    const { postKBCredentials } = this.props;
    const config = {
      attributes: {
        url: rmapiBaseUrl,
        customerId,
        apiKey,
        name,
      }
    };

    postKBCredentials(config);
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
                  config={{}}
                  onSubmit={obj => {
                    this.createConfig(obj);


                    console.log(kbCredentials);
                    // history.pushState();
                  }}
                  isModeCreate
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
    confirmPutKBCredentials: confirmPutKBCredentialsAction,
  }
)(SettingsKnowledgeBaseRoute);

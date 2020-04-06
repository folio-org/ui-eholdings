import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';

import { selectPropFromData } from '../redux/selectors';
import { Configuration } from '../redux/application';

import View from '../components/settings/settings-knowledge-base';

class SettingsKnowledgeBaseRoute extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    getBackendConfig: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    updateBackendConfig: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    props.getBackendConfig();
  }

  updateConfig = ({ rmapiBaseUrl, customerId, apiKey }) => {
    const { config, updateBackendConfig } = this.props;

    config.rmapiBaseUrl = rmapiBaseUrl;
    config.customerId = customerId;
    config.apiKey = apiKey;

    updateBackendConfig(config);
  };

  render() {
    const { config } = this.props;

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
                  model={config}
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

const kbCredentials = [
  {
    id: '1',
    type: 'credentials',
    attributes: {
      name: 'Amherst',
      apiKey: '',
      url: '',
      customerId: '',
    },
    metadata: {},
  },
  {
    id: '2',
    type: 'credentials',
    attributes: {
      name: 'Hampshire',
      apiKey: 'some-valid-api-key',
      url: 'https://sandbox.ebsco.io',
      customerId: 'some-valid-customer-id',
    },
    metadata: {},
  },
  {
    id: '3',
    type: 'credentials',
    attributes: {
      name: 'Some other',
      apiKey: 'some-valid-api-key',
      url: 'https://sandbox.ebsco.io',
      customerId: 'some-valid-customer-id',
    },
    metadata: {},
  },
]

export default connect(
  (store, { match: { params } }) => ({
    config: (selectPropFromData(store, 'credentials') || kbCredentials).find(cred => cred.id === params.kbId),
  }), {
    getBackendConfig: () => Configuration.find('configuration'),
    updateBackendConfig: model => Configuration.save(model)
  }
)(SettingsKnowledgeBaseRoute);

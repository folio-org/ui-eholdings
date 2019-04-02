import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes/core';

import { createResolver } from '../redux';
import { Configuration } from '../redux/application';

import View from '../components/settings-knowledge-base';

class SettingsKnowledgeBaseRoute extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    getBackendConfig: PropTypes.func.isRequired,
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
      <TitleManager page="eHoldings settings" record="Knowledge base">
        <View
          model={config}
          onSubmit={this.updateConfig}
        />
      </TitleManager>
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => ({
    config: createResolver(data).find('configurations', 'configuration')
  }), {
    getBackendConfig: () => Configuration.find('configuration'),
    updateBackendConfig: model => Configuration.save(model)
  }
)(SettingsKnowledgeBaseRoute);

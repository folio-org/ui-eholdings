import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from '@folio/stripes-components/lib/Icon';

import { createResolver } from '../redux';
import { Configuration } from '../redux/application';
import View from '../components/settings';
import ApplicationRoute from './application';

// eslint-disable-next-line no-shadow
class SettingsRoute extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    getBackendConfig: PropTypes.func.isRequired,
    updateBackendConfig: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.getBackendConfig();
  }

  updateConfig = ({ customerId, apiKey }) => {
    let { config, updateBackendConfig } = this.props;

    config.customerId = customerId;
    config.apiKey = apiKey;

    updateBackendConfig(config);
  };

  render() {
    let { config } = this.props;

    return (
      <ApplicationRoute showSettings>
        {config.isLoading ? (
          <Icon icon="spinner-ellipsis" />
        ) : (
          <View
            settings={config}
            onSubmit={this.updateConfig}
          />
        )}
      </ApplicationRoute>
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
)(SettingsRoute);

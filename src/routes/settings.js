import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Icon from '@folio/stripes-components/lib/Icon';
import { getBackendConfig, updateBackendConfig } from '../redux/application';
import View from '../components/settings';
import ApplicationRoute from './application';

// eslint-disable-next-line no-shadow
class SettingsRoute extends Component {
  static propTypes = {
    application: PropTypes.object.isRequired,
    getBackendConfig: PropTypes.func.isRequired,
    updateBackendConfig: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.getBackendConfig();
  }

  render() {
    let { application, updateBackendConfig } = this.props; // eslint-disable-line no-shadow

    return (
      <ApplicationRoute showSettings>
        {application.config.isPending ? (
          <Icon icon='spinner-ellipsis' />
        ) : (
          <View
            settings={application.config.content}
            update={application.update}
            onSubmit={updateBackendConfig}
          />
        )}
      </ApplicationRoute>
    );
  }
}

export default connect(
  ({ eholdings: { application } }) => ({ application }),
  { getBackendConfig, updateBackendConfig }
)(SettingsRoute);

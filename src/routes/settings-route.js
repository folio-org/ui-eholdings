import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import View from '../components/settings';
import ApplicationRoute from './application';
import { getKbCredentials } from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';

class SettingsRoute extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  componentDidMount() {
    this.props.getKbCredentials();
  }

  render() {
    const { children, location, kbCredentials } = this.props;

    return (
      <ApplicationRoute showSettings>
        <FormattedMessage id="ui-eholdings.label.settings">
          {pageTitle => (
            <TitleManager page={pageTitle}>
              <View location={location} kbCredentials={kbCredentials.items}>
                {children}
              </View>
            </TitleManager>
          )}
        </FormattedMessage>
      </ApplicationRoute>
    );
  }
}

export default connect(
  (store) => ({
    kbCredentials: selectPropFromData(store, 'kbCredentials'),
  }), {
    getKbCredentials
  }
)(SettingsRoute);

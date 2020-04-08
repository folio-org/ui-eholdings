import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { TitleManager } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';

import View from '../components/settings';
import ApplicationRoute from './application';

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
      apiKey: '',
      url: '',
      customerId: '',
    },
    metadata: {},
  },
];

class SettingsRoute extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  render() {
    const { children, location } = this.props;

    return (
      <ApplicationRoute showSettings>
        <FormattedMessage id="ui-eholdings.label.settings">
          {pageTitle => (
            <TitleManager page={pageTitle}>
              <View location={location} kbCredentials={kbCredentials}>
                {children}
              </View>
            </TitleManager>
          )}
        </FormattedMessage>
      </ApplicationRoute>
    );
  }
}

export default SettingsRoute;

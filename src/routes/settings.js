import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { TitleManager } from '@folio/stripes-core';

import { Settings as View } from '@folio/stripes-smart-components';
import ApplicationRoute from './application';

class SettingsRoute extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };

  render() {
    let { children, location, match } = this.props;

    let pages = React.Children.map(children, child => ({
      route: child.props.path,
      label: child.props.name,
      component: child.props.component
    }));

    return (
      <ApplicationRoute showSettings>
        <TitleManager page="eHoldings settings">
          <View
            paneTitle="eHoldings"
            activeLink={location.pathname}
            match={match}
            location={location}
            pages={pages}
          />
        </TitleManager>
      </ApplicationRoute>
    );
  }
}

export default withRouter(SettingsRoute);

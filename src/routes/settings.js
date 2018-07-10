import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TitleManager from '@folio/stripes-core/src/components/TitleManager';

import { Settings as View } from '@folio/stripes-components';
import ApplicationRoute from './application';

export default class SettingsRoute extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let { children } = this.props;
    let { router } = this.context;

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
            activeLink={router.route.location.pathname}
            match={router.route.match}
            location={router.route.location}
            pages={pages}
          />
        </TitleManager>
      </ApplicationRoute>
    );
  }
}

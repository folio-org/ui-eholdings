import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from './router';

import { reducer, epics } from './redux';

import ApplicationRoute from './routes/application';
import SearchRoute from './routes/search';
import VendorShow from './routes/vendor-show';
import PackageShow from './routes/package-show';
import CustomerResourceShow from './routes/customer-resource-show';
import TitleShow from './routes/title-show';

import SettingsRoute from './routes/settings';

export default class EHoldings extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired
    }).isRequired,
    stripes: PropTypes.shape({
      intl: PropTypes.object.isRequired
    }).isRequired,
    showSettings: PropTypes.bool
  };

  static contextTypes = {
    addReducer: PropTypes.func.isRequired,
    addEpic: PropTypes.func.isRequired
  };

  static childContextTypes = {
    intl: PropTypes.object
  }

  getChildContext() {
    return {
      intl: this.props.stripes.intl
    };
  }

  componentWillMount() {
    this.context.addReducer('eholdings', reducer);
    this.context.addEpic('eholdings', epics);
  }

  render() {
    let {
      showSettings,
      match: { path: rootPath }
    } = this.props;

    return showSettings ? (
      <Route path={rootPath} component={SettingsRoute} />
    ) : (
      <Route path={rootPath} component={ApplicationRoute}>
        <Route path={rootPath} component={SearchRoute}>
          <Switch>
            <Route path={`${rootPath}/vendors/:vendorId`} exact component={VendorShow} />
            <Route path={`${rootPath}/vendors/:vendorId/packages/:packageId`} exact component={PackageShow} />
            <Route path={`${rootPath}/vendors/:vendorId/packages/:packageId/titles/:titleId`} exact component={CustomerResourceShow} />
            <Route path={`${rootPath}/titles/:titleId`} exact component={TitleShow} />
            <Route render={() => (<Redirect to={`${rootPath}?searchType=vendors`} />)} />
          </Switch>
        </Route>
      </Route>
    );
  }
}

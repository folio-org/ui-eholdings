import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from './router';

import { reducer, epics } from './redux';

import SearchRoute from './routes/search';
import VendorSearchResultsRoute from './routes/vendor/vendor-search-results';
import PackageSearchResultsRoute from './routes/package/package-search-results';
import TitleSearchResultsRoute from './routes/title/title-search-results';

import VendorShow from './routes/vendor/vendor-show';
import PackageShow from './routes/package/package-show';
import CustomerResourceShow from './routes/customer-resource/customer-resource-show';
import TitleShow from './routes/title/title-show';

export default class EHoldings extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired
    }).isRequired,
    stripes: PropTypes.shape({
      intl: PropTypes.object.isRequired
    }).isRequired
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
    const rootPath = this.props.match.path;

    return(
      <Switch>
        <Route path={`${rootPath}/search/:searchType(vendors|packages|titles)`} component={SearchRoute}>
          <Route path={`${rootPath}/search/vendors`} exact component={VendorSearchResultsRoute}/>
          <Route path={`${rootPath}/search/packages`} exact component={PackageSearchResultsRoute}/>
          <Route path={`${rootPath}/search/titles`} exact component={TitleSearchResultsRoute}/>
        </Route>

        <Route path={`${rootPath}/vendors/:vendorId`} exact component={VendorShow}/>
        <Route path={`${rootPath}/vendors/:vendorId/packages/:packageId`} exact component={PackageShow}/>
        <Route path={`${rootPath}/vendors/:vendorId/packages/:packageId/titles/:titleId`} exact component={CustomerResourceShow}/>
        <Route path={`${rootPath}/titles/:titleId`} exact component={TitleShow}/>
        <Route render={() => (<Redirect to={`${rootPath}/search/vendors`}/>)}/>
      </Switch>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

import SearchVendors from './routes/search/search-vendors';
import SearchPackages from './routes/search/search-packages';
import SearchTitles from './routes/search/search-titles';
import VendorShow from './routes/vendor/vendor-show';
import PackageShow from './routes/package/package-show';
import CustomerResourceShow from './routes/customer-resource/customer-resource-show';
import TitleShow from './routes/title/title-show';

export default class EHoldings extends Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      locale: PropTypes.string.isRequired
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired
    }).isRequired,
    okapi: PropTypes.object
  }

  static childContextTypes = {
    formatDate: PropTypes.func
  }

  getChildContext() {
    return {
      formatDate: (dateString) => {
        return new Date(Date.parse(dateString)).toLocaleDateString(this.props.stripes.locale)
      }
    }
  }

  constructor(props) {
    super(props);
    this.SearchVendors = props.stripes.connect(SearchVendors);
    this.SearchPackages = props.stripes.connect(SearchPackages);
    this.SearchTitles = props.stripes.connect(SearchTitles);
    this.VendorShow = props.stripes.connect(VendorShow);
    this.PackageShow = props.stripes.connect(PackageShow);
    this.CustomerResourceShow = props.stripes.connect(CustomerResourceShow);
    this.TitleShow = props.stripes.connect(TitleShow);
  }

  render() {
    const rootPath = this.props.match.path;

    return(
      <Switch>
        <Route path={`${rootPath}/vendors`} exact component={this.SearchVendors}/>
        <Route path={`${rootPath}/packages`} exact component={this.SearchPackages}/>
        <Route path={`${rootPath}/titles`} exact component={this.SearchTitles}/>
        <Route path={`${rootPath}/vendors/:vendorId`} exact component={this.VendorShow}/>
        <Route path={`${rootPath}/vendors/:vendorId/packages/:packageId`} exact component={this.PackageShow}/>
        <Route path={`${rootPath}/vendors/:vendorId/packages/:packageId/titles/:titleId`} exact component={this.CustomerResourceShow}/>
        <Route path={`${rootPath}/titles/:titleId`} exact component={this.TitleShow}/>
        <Route render={() => (<Redirect to={`${rootPath}/vendors`}/>)}/>
      </Switch>
    );
  }
}

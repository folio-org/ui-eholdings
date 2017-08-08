import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';

import App from './components/app';
import VendorShow from './routes/vendor/vendor-show';

export default class EHoldings extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired
    }).isRequired
  }

  render() {
    const rootPath = this.props.match.path;

    return(
      <Switch>
        <Route path={rootPath} exact component={App}/>
        <Route path={`${rootPath}/vendors/:vendorId`} exact component={VendorShow}/>
      </Switch>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Settings from '@folio/stripes-components/lib/Settings';

import { Route, Switch, Redirect } from './router';
import { reducer, epics } from './redux';

import ApplicationRoute from './routes/application';
import SearchRoute from './routes/search';
import ProviderShow from './routes/provider-show';
import PackageShow from './routes/package-show';
import PackageEdit from './routes/package-edit';
import TitleShow from './routes/title-show';
import CustomerResourceShow from './routes/customer-resource-show';
import CustomerResourceEdit from './routes/customer-resource-edit';

import SettingsKnowledgeBaseRoute from './routes/settings-knowledge-base';
import SettingsRootProxyRoute from './routes/settings-root-proxy';

export default class EHoldings extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired
    }).isRequired,
    stripes: PropTypes.shape({
      intl: PropTypes.object.isRequired,
      locale: PropTypes.string.isRequired
    }).isRequired,
    showSettings: PropTypes.bool
  };

  static contextTypes = {
    addReducer: PropTypes.func.isRequired,
    addEpic: PropTypes.func.isRequired,
    router: PropTypes.object
  };

  static childContextTypes = {
    intl: PropTypes.object,
    locale: PropTypes.string
  }

  getChildContext() {
    return {
      intl: this.props.stripes.intl,
      locale: this.props.stripes.locale
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
    let { router } = this.context;

    return showSettings ? (
      <Settings
        {...this.props}
        pages={[
          {
            route: 'knowledge-base',
            label: 'Knowledge base',
            component: SettingsKnowledgeBaseRoute
          },
          {
            route: 'root-proxy',
            label: 'Root proxy',
            component: SettingsRootProxyRoute
          }
        ]}
        paneTitle="eHoldings"
        activeLink={router.route.location.pathname}
      />
    ) : (
      <Route path={rootPath} component={ApplicationRoute}>
        <Route path={`${rootPath}/:type?/:id?`} component={SearchRoute}>
          <Switch>
            <Route path={`${rootPath}/providers/:providerId`} exact component={ProviderShow} />
            <Route path={`${rootPath}/packages/:packageId`} exact component={PackageShow} />
            <Route path={`${rootPath}/packages/:packageId/edit`} exact component={PackageEdit} />
            <Route path={`${rootPath}/titles/:titleId`} exact component={TitleShow} />
            <Route path={`${rootPath}/customer-resources/:id`} exact component={CustomerResourceShow} />
            <Route path={`${rootPath}/customer-resources/:id/edit`} exact component={CustomerResourceEdit} />
            <Route render={() => (<Redirect to={`${rootPath}?searchType=providers`} />)} />
          </Switch>
        </Route>
      </Route>
    );
  }
}

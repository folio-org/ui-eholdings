import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRoot } from '@folio/stripes-core/src/components/Root/RootContext';
import { hot } from 'react-hot-loader';

import { Route, Switch, Redirect } from './router';
import { reducer, epics } from './redux';

import ApplicationRoute from './routes/application';
import SettingsRoute from './routes/settings-route';
import SearchRoute from './routes/search';
import ProviderShow from './routes/provider-show';
import ProviderEdit from './routes/provider-edit';
import PackageShow from './routes/package-show';
import PackageEdit from './routes/package-edit';
import PackageCreate from './routes/package-create';
import TitleShow from './routes/title-show';
import TitleEdit from './routes/title-edit';
import TitleCreate from './routes/title-create';
import ResourceShow from './routes/resource-show';
import ResourceEdit from './routes/resource-edit';

import SettingsKnowledgeBaseRoute from './routes/settings-knowledge-base';
import SettingsRootProxyRoute from './routes/settings-root-proxy';

class EHoldings extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired
    }).isRequired,
    root: PropTypes.shape({
      addEpic: PropTypes.func.isRequired,
      addReducer: PropTypes.func.isRequired,
    }),
    showSettings: PropTypes.bool
  };

  constructor(props) {
    super(props);
    props.root.addReducer('eholdings', reducer);
    props.root.addEpic('eholdings', epics);
  }

  render() {
    const {
      showSettings,
      match: { path: rootPath }
    } = this.props;

    return showSettings ? (
      <Route path={rootPath} component={SettingsRoute}>
        <Route path={`${rootPath}/knowledge-base`} exact component={SettingsKnowledgeBaseRoute} />
        <Route path={`${rootPath}/root-proxy`} exact component={SettingsRootProxyRoute} />
      </Route>
    ) : (
      <Route path={rootPath} component={ApplicationRoute}>
        <Route path={`${rootPath}/:type?/:id?`} component={SearchRoute}>
          <Switch>
            <Route path={`${rootPath}/providers/:providerId`} exact component={ProviderShow} />
            <Route path={`${rootPath}/providers/:providerId/edit`} exact component={ProviderEdit} />
            <Route path={`${rootPath}/packages/new`} exact component={PackageCreate} />
            <Route path={`${rootPath}/packages/:packageId`} exact component={PackageShow} />
            <Route path={`${rootPath}/packages/:packageId/edit`} exact component={PackageEdit} />
            <Route path={`${rootPath}/titles/new`} exact component={TitleCreate} />
            <Route path={`${rootPath}/titles/:titleId`} exact component={TitleShow} />
            <Route path={`${rootPath}/titles/:titleId/edit`} exact component={TitleEdit} />
            <Route path={`${rootPath}/resources/:id`} exact component={ResourceShow} />
            <Route path={`${rootPath}/resources/:id/edit`} exact component={ResourceEdit} />
            <Route render={() => (<Redirect to={`${rootPath}?searchType=providers`} />)} />
          </Switch>
        </Route>
      </Route>
    );
  }
}

export default hot(module)(withRoot(EHoldings));

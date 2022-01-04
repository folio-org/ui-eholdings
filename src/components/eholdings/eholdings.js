import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { CommandList } from '@folio/stripes/components';

import {
  Route,
  Switch,
} from '../../router';
import {
  reducer,
  epics,
} from '../../redux';

import ApplicationRoute from '../../routes/application-route';
import SettingsRoute from '../../routes/settings-route';
import SearchRoute from '../../routes/search-route';
import ProviderShow from '../../routes/provider-show-route';
import ProviderEdit from '../../routes/provider-edit';
import PackageShow from '../../routes/package-show';
import PackageEdit from '../../routes/package-edit';
import PackageCreate from '../../routes/package-create-route';
import TitleShowRoute from '../../routes/title-show-route';
import TitleEditRoute from '../../routes/title-edit-route';
import TitleCreateRoute from '../../routes/title-create-route';
import ResourceShow from '../../routes/resource-show';
import ResourceEdit from '../../routes/resource-edit';
import NoteCreate from '../../routes/note-create';
import NoteView from '../../routes/note-view';
import NoteEdit from '../../routes/note-edit';

import SettingsCustomLabelsRoute from '../../routes/custom-labels-route';
import SettingsKnowledgeBaseRoute from '../../routes/settings-knowledge-base-route';
import SettingsRootProxyRoute from '../../routes/settings-root-proxy-route';
import SettingsAccessStatusTypesRoute from '../../routes/settings-access-status-types-route';
import SettingsAssignedUsersRoute from '../../routes/settings-assigned-users-route';
import SettingsUsageConsolidationRoute from '../../routes/settings-usage-consolidation-route';

import KeyShortcutsWrapper from '../key-shortcuts-wrapper';
import EHoldingsAppContext from '../eholdings-app-context';
import { commands } from '../../commands';

class EHoldings extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    root: PropTypes.shape({
      addEpic: PropTypes.func.isRequired,
      addReducer: PropTypes.func.isRequired,
    }).isRequired,
    showSettings: PropTypes.bool,
  };

  static defaultProps = {
    showSettings: false,
  };

  constructor(props) {
    super(props);

    props.root.addReducer('eholdings', reducer);
    props.root.addEpic('eholdings', epics);
  }

  componentDidMount() {
    const {
      history,
      location: {
        pathname,
        search,
      },
    } = this.props;

    const currentURL = `${pathname}${search}`;

    history.replace(currentURL, {});
  }

  focusSearchField = () => {
    const {
      history,
      location: { search },
    } = this.props;

    const searchElement = document.getElementById('eholdings-search');

    if (searchElement) {
      searchElement.focus();
    } else {
      history.push({ pathname: '/eholdings', search });
    }
  };

  render() {
    const {
      showSettings,
      match: { path: rootPath },
    } = this.props;

    return (
      <CommandList commands={commands}>
        {showSettings
          ? (
            <Route path={rootPath} component={SettingsRoute}>
              <Route path={`${rootPath}/knowledge-base/:kbId`} exact component={SettingsKnowledgeBaseRoute} />
              <Route path={`${rootPath}/:kbId/root-proxy`} exact component={SettingsRootProxyRoute} />
              <Route path={`${rootPath}/:kbId/custom-labels`} exact component={SettingsCustomLabelsRoute} />
              <Route path={`${rootPath}/:kbId/access-status-types`} exact component={SettingsAccessStatusTypesRoute} />
              <Route path={`${rootPath}/:kbId/users`} exact component={SettingsAssignedUsersRoute} />
              <Route path={`${rootPath}/:kbId/usage-consolidation`} exact component={SettingsUsageConsolidationRoute} />
            </Route>
          )
          : (
            <>
              <EHoldingsAppContext />
              <KeyShortcutsWrapper focusSearchField={this.focusSearchField}>
                <Route path={rootPath} component={ApplicationRoute}>
                  <Switch>
                    <Route path={`${rootPath}/providers/:providerId`} exact component={ProviderShow} />
                    <Route path={`${rootPath}/providers/:providerId/edit`} exact component={ProviderEdit} />
                    <Route path={`${rootPath}/packages/new`} exact component={PackageCreate} />
                    <Route path={`${rootPath}/packages/:packageId`} exact component={PackageShow} />
                    <Route path={`${rootPath}/packages/:packageId/edit`} exact component={PackageEdit} />
                    <Route path={`${rootPath}/titles/new`} exact component={TitleCreateRoute} />
                    <Route path={`${rootPath}/titles/:titleId`} exact component={TitleShowRoute} />
                    <Route path={`${rootPath}/titles/:titleId/edit`} exact component={TitleEditRoute} />
                    <Route path={`${rootPath}/resources/:id`} exact component={ResourceShow} />
                    <Route path={`${rootPath}/resources/:id/edit`} exact component={ResourceEdit} />
                    <Route path={`${rootPath}/notes/new`} exact component={NoteCreate} />
                    <Route path={`${rootPath}/notes/:noteId`} exact component={NoteView} />
                    <Route path={`${rootPath}/notes/:id/edit`} exact component={NoteEdit} />
                    <Route path={`${rootPath}/`} exact component={SearchRoute} />
                  </Switch>
                </Route>
              </KeyShortcutsWrapper>
            </>
          )
        }
      </CommandList>
    );
  }
}

export default EHoldings;

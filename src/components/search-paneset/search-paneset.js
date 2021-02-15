import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IfPermission,
  AppIcon,
  withStripes,
} from '@folio/stripes/core';
import {
  Button,
  PaneMenu,
  Pane,
  Paneset,
  HasCommand,
  checkScope,
} from '@folio/stripes/components';
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
} from '@folio/stripes/smart-components';

import styles from './search-paneset.css';

import {
  searchTypes,
  APP_ICON_NAME,
} from '../../constants';

class SearchPaneset extends Component {
  static propTypes = {
    filterCount: PropTypes.number,
    hideFilters: PropTypes.bool,
    history: ReactRouterPropTypes.history,
    isLoading: PropTypes.bool,
    resultPaneTitle: PropTypes.node,
    resultsLabel: PropTypes.node,
    resultsType: PropTypes.string,
    resultsView: PropTypes.node,
    searchForm: PropTypes.node,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    totalResults: PropTypes.number,
    updateFilters: PropTypes.func.isRequired
  };

  static defaultProps = {
    totalResults: 0
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  createDeletePermissionName = 'ui-eholdings.titles-packages.create-delete';

  isPackageOrTitle = (resultsType) => !!(resultsType === searchTypes.PACKAGES || resultsType === searchTypes.TITLES);

  openCreateNewEntity = () => {
    const {
      stripes,
      history,
      resultsType,
    } = this.props;

    const createDeletePermission = stripes.hasPerm(this.createDeletePermissionName);

    if (this.isPackageOrTitle(resultsType) && createDeletePermission) {
      history.push({
        pathname: `/eholdings/${resultsType}/new`,
        state: { eholdings: true }
      });
    }
  };

  shortcuts = [
    {
      name: 'new',
      handler: this.openCreateNewEntity,
    },
  ];

  toggleFilters = () => {
    this.props.updateFilters(hideFilters => !hideFilters);
  };

  renderNewButton = () => {
    return (
      <IfPermission perm={this.createDeletePermissionName}>
        <Button
          data-test-eholdings-search-new-button
          buttonStyle="primary"
          marginBottom0
          to={{
            pathname: `/eholdings/${this.props.resultsType}/new`,
            state: { eholdings: true }
          }}
        >
          <FormattedMessage id="ui-eholdings.search.addNew" />
        </Button>
      </IfPermission>
    );
  };

  getSearchResultsPaneFirstMenu = () => {
    const {
      hideFilters,
      resultsView,
      filterCount,
    } = this.props;

    const areFiltersHidden = hideFilters && !!resultsView;
    // do not show filter count when filters are open
    const filterCountToDisplay = areFiltersHidden
      ? filterCount
      : 0;

    return hideFilters
      ? (
        <PaneMenu>
          <ExpandFilterPaneButton
            onClick={this.toggleFilters}
            filterCount={filterCountToDisplay}
          />
        </PaneMenu>
      )
      : null;
  }

  render() {
    const {
      searchForm,
      resultsLabel,
      resultPaneTitle,
      resultsType,
      resultsView,
      totalResults,
      isLoading,
      hideFilters,
    } = this.props;

    let newButton = (<PaneMenu />);

    if (this.isPackageOrTitle(resultsType)) {
      newButton = this.renderNewButton();
    }

    let resultsPaneSub = (<FormattedMessage id="ui-eholdings.search.loading" />);
    if (!isLoading) {
      resultsPaneSub = (
        <FormattedMessage
          id="ui-eholdings.resultCount"
          values={{
            count: totalResults
          }}
        />
      );
    }

    return (
      <HasCommand
        commands={this.shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          {!hideFilters &&
            <Pane
              id="search-pane"
              tagName="section"
              defaultWidth="320px"
              fluidContentWidth={false}
              paneTitle={(<FormattedMessage id="ui-eholdings.search.searchAndFilter" />)}
              lastMenu={
                <PaneMenu>
                  <CollapseFilterPaneButton onClick={this.toggleFilters} />
                </PaneMenu>
              }
              data-test-eholdings-search-pane
            >
              {searchForm}
            </Pane>}

          <Pane
            appIcon={<AppIcon app={APP_ICON_NAME} />}
            defaultWidth="fill"
            firstMenu={this.getSearchResultsPaneFirstMenu()}
            id="search-results"
            lastMenu={newButton}
            paneSub={resultsView && resultsPaneSub}
            padContent={false}
            paneTitle={resultsLabel}
            paneTitleRef={resultPaneTitle}
            data-test-results-pane
          >
            {resultsView || (
              <div
                className={styles['pre-search-pane-content']}
                data-test-eholdings-pre-search-pane
              >
                <div className={styles['pre-search-pane-content-label']}>
                  <p>
                    <FormattedMessage id="ui-eholdings.search.enterQuery" />
                  </p>
                </div>
              </div>
            )}
          </Pane>
        </Paneset>
      </HasCommand>
    );
  }
}

export default withStripes(SearchPaneset);

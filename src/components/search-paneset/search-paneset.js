import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IfPermission,
  AppIcon
} from '@folio/stripes-core';

import {
  Button,
  PaneMenu,
} from '@folio/stripes/components';
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
} from '@folio/stripes/smart-components';

import Paneset, { Pane } from '../paneset';

import styles from './search-paneset.css';

import {
  searchTypes,
  APP_ICON_NAME,
} from '../../constants';

export default class SearchPaneset extends Component {
  static propTypes = {
    detailsView: PropTypes.node,
    filterCount: PropTypes.number,
    hideFilters: PropTypes.bool,
    isLoading: PropTypes.bool,
    location: PropTypes.object.isRequired,
    onClosePreview: PropTypes.func.isRequired,
    resultsLabel: PropTypes.node,
    resultsType: PropTypes.string,
    resultsView: PropTypes.node,
    searchForm: PropTypes.node,
    totalResults: PropTypes.number,
    updateFilters: PropTypes.func.isRequired
  };

  static defaultProps = {
    totalResults: 0
  };


  // The `detailsView` is a <Switch> component which, by default, uses it's
  // location context to determine the correct route to render. By manually
  // providing a location prop, we can safely animate it when the real route
  // changes and manually update it's location after the animation.
  static getDerivedStateFromProps(nextProps, nextState) {
    const { detailsView, location } = nextProps;

    return {
      detailsView: detailsView
        ? cloneElement(detailsView, { location })
        : nextState.detailsView,
      showDetailsView: !!detailsView
    };
  }

  state = {};

  // used to focus the pane title when a new search happens
  $title = React.createRef(); // eslint-disable-line react/sort-comp

  // focus the pane title if we mounted with existing search results and no details view
  componentDidMount() {
    if (this.props.resultsView && !this.props.detailsView && this.$title.current) {
      this.$title.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const isNewSearch = prevProps.location.search !== this.props.location.search;
    const isSameSearchType = prevProps.resultsType === this.props.resultsType;

    // focus the pane title when a new search happens within the same search type
    if (isNewSearch && isSameSearchType && this.$title.current) {
      this.$title.current.focus();
    }
  }

  toggleFilters = () => {
    this.props.updateFilters(hideFilters => !hideFilters);
  };

  clearDetailsView = () => {
    this.setState({ detailsView: null });
  };

  renderNewButton = () => {
    return (
      <IfPermission perm="ui-eholdings.titles-packages.create-delete">
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

  render() {
    const {
      searchForm,
      resultsLabel,
      resultsType,
      resultsView,
      totalResults,
      isLoading,
      hideFilters,
      filterCount,
      onClosePreview
    } = this.props;

    const {
      detailsView,
      showDetailsView,
    } = this.state;

    const areFiltersHidden = hideFilters && !!resultsView;

    let newButton = (<PaneMenu />);
    if (resultsType === searchTypes.PACKAGES || resultsType === searchTypes.TITLES) {
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

    // do not show filter count when filters are open
    const filterCountToDisplay = areFiltersHidden
      ? filterCount
      : 0;

    return (
      <Paneset>
        { !hideFilters &&
          <Pane
            tagName="section"
            onDismiss={this.toggleFilters}
            className={styles['search-pane']}
            paneTitle={(<FormattedMessage id="ui-eholdings.search.searchAndFilter" />)}
            paneHeaderId="search-pane-header"
            lastMenu={
              <PaneMenu>
                <CollapseFilterPaneButton onClick={this.toggleFilters} />
              </PaneMenu>
            }
            data-test-eholdings-search-pane
          >
            {searchForm}
          </Pane>
        }

        <Pane
          static
          flexGrow={5}
          padContent={false}
          appIcon={<AppIcon app={APP_ICON_NAME} />}
          paneTitle={resultsLabel}
          paneSub={resultsView && resultsPaneSub}
          paneTitleRef={this.$title}
          paneHeaderId="search-results"
          firstMenu={hideFilters &&
            <PaneMenu>
              <ExpandFilterPaneButton
                onClick={this.toggleFilters}
                filterCount={filterCountToDisplay}
              />
            </PaneMenu>
          }
          lastMenu={newButton}
          data-test-results-pane
        >
          {resultsView || (
            <div
              className={styles['pre-search-pane-content']}
              data-test-eholdings-pre-search-pane
            >
              <div className={styles['pre-search-pane-content-label']}>
                <p><FormattedMessage id="ui-eholdings.search.enterQuery" /></p>
              </div>
            </div>
          )}
        </Pane>

        <Pane
          flexGrow={11}
          padContent={false}
          className={styles['search-detail-pane']}
          onDismiss={onClosePreview}
          onExited={this.clearDetailsView}
          visible={!!showDetailsView}
          data-test-preview-pane={resultsType}
        >
          {detailsView}
        </Pane>
      </Paneset>
    );
  }
}

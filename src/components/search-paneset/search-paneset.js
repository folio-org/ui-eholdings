import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Button, PaneMenu } from '@folio/stripes/components';
import capitalize from 'lodash/capitalize';
import { FormattedMessage } from 'react-intl';

import Paneset, { Pane } from '../paneset';

import styles from './search-paneset.css';
import SearchBadge from '../search-modal/search-badge';

export default class SearchPaneset extends Component {
  static propTypes = {
    detailsView: PropTypes.node,
    filterCount: PropTypes.number,
    hideFilters: PropTypes.bool,
    isLoading: PropTypes.bool,
    location: PropTypes.object.isRequired,
    onClosePreview: PropTypes.func.isRequired,
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
    let { detailsView, location } = nextProps;

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
    let isNewSearch = prevProps.location.search !== this.props.location.search;
    let isSameSearchType = prevProps.resultsType === this.props.resultsType;

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
    );
  };

  render() {
    let {
      searchForm,
      resultsType,
      resultsView,
      totalResults,
      isLoading,
      hideFilters,
      filterCount,
      onClosePreview
    } = this.props;
    let {
      detailsView,
      showDetailsView
    } = this.state;

    hideFilters = hideFilters && !!resultsView;

    let newButton = (<PaneMenu />);
    if (resultsType === 'packages' || resultsType === 'titles') {
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

    let showApply = resultsView && !hideFilters;

    // do not show filter count when filters are open
    filterCount = hideFilters ? filterCount : 0;

    return (
      <Paneset>
        <Pane
          aside
          onDismiss={this.toggleFilters}
          visible={!hideFilters}
          className={styles['search-pane']}
          paneTitle={(<FormattedMessage id="ui-eholdings.search.searchAndFilter" />)}
          lastMenu={showApply ? (
            <Button
              buttonStyle="transparent"
              onClick={this.toggleFilters}
              buttonClass={styles['search-pane-toggle']}
            >
              <FormattedMessage id="ui-eholdings.search.apply" />
            </Button>
          ) : null}
          data-test-eholdings-search-pane
        >
          {searchForm}
        </Pane>

        <Pane
          static
          flexGrow={5}
          appIcon={{ app: 'eholdings' }}
          paneTitle={capitalize(resultsType)}
          paneSub={resultsView && resultsPaneSub}
          paneTitleRef={this.$title}
          firstMenu={resultsView ? (
            <div className={styles['results-pane-search-toggle']}>
              <SearchBadge
                data-test-eholdings-results-pane-search-badge
                onClick={this.toggleFilters}
                filterCount={filterCount}
              />
            </div>
          ) : null}
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

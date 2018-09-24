import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  PaneHeader,
  PaneMenu
} from '@folio/stripes-components';
import capitalize from 'lodash/capitalize';
import { FormattedMessage } from 'react-intl';

import SearchPane from '../search-pane';
import ResultsPane from '../results-pane';
import PreviewPane from '../preview-pane';
import SearchPaneVignette from '../search-pane-vignette';
import Link from '../link';
import styles from './search-paneset.css';
import SearchBadge from '../search-modal/search-badge';

export default class SearchPaneset extends React.Component { // eslint-disable-line react/no-deprecated
  static propTypes = {
    detailsView: PropTypes.node,
    filterCount: PropTypes.number,
    hideFilters: PropTypes.bool,
    isLoading: PropTypes.bool,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired
    }).isRequired,
    resultsType: PropTypes.string,
    resultsView: PropTypes.node,
    searchForm: PropTypes.node,
    totalResults: PropTypes.number,
    updateFilters: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object
    })
  };

  static defaultProps = {
    totalResults: 0
  };

  // used to focus the pane title when a new search happens
  $title = React.createRef(); // eslint-disable-line react/sort-comp

  // focus the pane title if we mounted with existing search results and no details view
  componentDidMount() {
    if (this.props.resultsView && !this.props.detailsView) {
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

  toggleFilters = () => this.props.updateFilters(hideFilters => !hideFilters)

  closePreview = () => {
    this.context.router.history.push({
      pathname: '/eholdings',
      search: this.props.location.search
    });
  };

  renderNewButton = () => {
    return (
      <Link
        className={styles['search-new-button']}
        to={`/eholdings/${this.props.resultsType}/new`}
      >
        <FormattedMessage id="ui-eholdings.search.addNew" />
      </Link>
    );
  };

  render() {
    let {
      searchForm,
      resultsType,
      resultsView,
      detailsView,
      totalResults,
      isLoading,
      hideFilters,
      filterCount
    } = this.props;

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
      <div className={styles['search-paneset']}>
        {detailsView && (
          <SearchPaneVignette className={styles['preview-pane-vignette']} onClick={this.closePreview} />
        )}

        {!hideFilters && (
          <SearchPaneVignette className={styles['filters-pane-vignette']} onClick={this.toggleFilters} />
        )}

        {!hideFilters &&
          <SearchPane>
            <div data-test-eholdings-search-pane>
              <PaneHeader
                paneTitle={(<FormattedMessage id="ui-eholdings.search.searchAndFilter" />)}
                lastMenu={showApply ? (
                  <Button buttonStyle="transparent" onClick={this.toggleFilters} buttonClass={styles['search-pane-toggle']}>
                    <FormattedMessage id="ui-eholdings.search.apply" />
                  </Button>
                ) : null}
              />
              <div className={styles['scrollable-container']}>
                {searchForm}
              </div>
            </div>
          </SearchPane>
        }

        {resultsView ? (
          <ResultsPane>
            <div data-test-eholdings-search-results-header>
              <PaneHeader
                appIcon={{
                  app: 'eholdings'
                }}
                paneTitle={capitalize(resultsType)}
                paneSub={resultsPaneSub}
                paneTitleRef={this.$title}
                firstMenu={
                  <div className={styles['results-pane-search-toggle']}>
                    <SearchBadge
                      data-test-eholdings-results-pane-search-badge
                      onClick={this.toggleFilters}
                      filterCount={filterCount}
                    />
                  </div>
                }
                lastMenu={newButton}
              />
            </div>
            <div className={styles['scrollable-container']}>
              {resultsView}
            </div>
          </ResultsPane>
        ) : (
          <div
            data-test-eholdings-pre-search-pane
            className={styles['pre-search-pane']}
          >
            <PaneHeader
              appIcon={{
                app: 'eholdings'
              }}
              paneTitle={capitalize(resultsType)}
              lastMenu={newButton}
            />
            <div className={styles['pre-search-pane-content']}>
              <div className={styles['pre-search-pane-content-label']}>
                <p><FormattedMessage id="ui-eholdings.search.enterQuery" /></p>
              </div>
            </div>
          </div>
        )}

        {!!detailsView && (
          <PreviewPane previewType={resultsType}>
            {detailsView}
          </PreviewPane>
        )}
      </div>
    );
  }
}

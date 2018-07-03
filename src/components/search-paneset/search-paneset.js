import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  IconButton,
  PaneHeader,
  PaneMenu
} from '@folio/stripes-components';
import capitalize from 'lodash/capitalize';
import { FormattedMessage } from 'react-intl';

import { qs } from '../utilities';
import SearchPane from '../search-pane';
import ResultsPane from '../results-pane';
import PreviewPane from '../preview-pane';
import SearchPaneVignette from '../search-pane-vignette';
import Link from '../link';
import styles from './search-paneset.css';

export default class SearchPaneset extends React.Component { // eslint-disable-line react/no-deprecated
  static propTypes = {
    searchForm: PropTypes.node,
    hideFilters: PropTypes.bool,
    resultsType: PropTypes.string,
    resultsView: PropTypes.node,
    detailsView: PropTypes.node,
    totalResults: PropTypes.number,
    isLoading: PropTypes.bool,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired
    }).isRequired
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object
    })
  };

  static defaultProps = {
    totalResults: 0
  };

  state = {
    hideFilters: this.props.hideFilters
  };

  // used to focus the pane title when a new search happens
  $title = React.createRef(); // eslint-disable-line react/sort-comp

  // focus the pane title if we mounted with existing search results and no details view
  componentDidMount() {
    if (this.props.resultsView && !this.props.detailsView) {
      this.$title.current.focus();
    }
  }

  componentWillReceiveProps({ resultsType, location }) {
    let isSameLocation = location.search === this.props.location.search;

    if (!isSameLocation) {
      let isSameSearchType = resultsType === this.props.resultsType;

      if (isSameSearchType) {
        let { ...nextSearchParams } = qs.parse(location.search);
        let { ...searchParams } = qs.parse(this.props.location.search);

        let searchTermChanged = nextSearchParams.q !== searchParams.q;

        if (searchTermChanged) {
          this.setState({ hideFilters: true });
        } else {
          this.setState({ hideFilters: false });
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    let isNewSearch = prevProps.location.search !== this.props.location.search;
    let isSameSearchType = prevProps.resultsType === this.props.resultsType;

    // focus the pane title when a new search happens within the same search type
    if (isNewSearch && isSameSearchType) {
      this.$title.current.focus();
    }
  }

  toggleFilters = () => {
    this.setState(({ hideFilters }) => ({
      hideFilters: !hideFilters
    }));
  };

  closePreview = () => {
    this.context.router.history.push({
      pathname: '/eholdings',
      search: this.props.location.search
    });
  };

  renderNewButton = () => {
    return (
      <PaneMenu>
        <Link
          className={styles['search-new-button']}
          to={`/eholdings/${this.props.resultsType}/new`}
        >
          + New
        </Link>
      </PaneMenu>
    );
  };

  render() {
    let { hideFilters } = this.state;
    let {
      searchForm,
      resultsType,
      resultsView,
      detailsView,
      totalResults,
      isLoading
    } = this.props;

    // only hide filters if there are results and always hide filters when a detail view is visible
    hideFilters = (hideFilters && !!resultsView) || !!detailsView;

    let newButton = (<PaneMenu />);
    if (resultsType === 'packages' || resultsType === 'titles') {
      newButton = this.renderNewButton();
    }

    let resultsPaneSub = 'Loading...';
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
      <div className={styles['search-paneset']}>
        <SearchPaneVignette isHidden={hideFilters || !resultsView} onClick={this.toggleFilters} />

        {!!detailsView && (
          <SearchPaneVignette onClick={this.closePreview} />
        )}

        <SearchPane isHidden={hideFilters}>
          <PaneHeader
            paneTitle="Search &amp; Filter"
            lastMenu={resultsView ? (
              <PaneMenu>
                <Button buttonStyle="transparent" onClick={this.toggleFilters} className={styles['search-pane-toggle']}>
                  Apply
                </Button>
              </PaneMenu>
            ) : null}
          />
          <div className={styles['scrollable-container']}>
            {searchForm}
          </div>
        </SearchPane>

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
                    <PaneMenu>
                      <IconButton
                        onClick={this.toggleFilters}
                        icon="search"
                      />
                    </PaneMenu>
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
                <p>Enter a query to show search results.</p>
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

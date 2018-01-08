import React from 'react';
import PropTypes from 'prop-types';
import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Button from '@folio/stripes-components/lib/Button';
import capitalize from 'lodash/capitalize';

import SearchPane from '../search-pane';
import ResultsPane from '../results-pane';
import PreviewPane from '../preview-pane';
import SearchPaneVignette from '../search-pane-vignette';

import styles from './search-paneset.css';

export default class SearchPaneset extends React.Component {
  static propTypes = {
    searchForm: PropTypes.node,
    hideFilters: PropTypes.bool,
    resultsType: PropTypes.string,
    resultsView: PropTypes.node,
    detailsView: PropTypes.node,
    totalResults: PropTypes.number,
    location: PropTypes.object
  };

  static defaultProps = {
    totalResults: 0
  };

  static contextTypes = {
    intl: PropTypes.object,
    router: PropTypes.shape({
      history: PropTypes.object
    })
  };

  state = {
    hideFilters: this.props.hideFilters
  };

  componentWillReceiveProps({ hideFilters, resultsType }) {
    let isSameSearchType = resultsType === this.props.resultsType;

    if (isSameSearchType && hideFilters !== this.state.hideFilters) {
      this.setState({ hideFilters });
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

  render() {
    let { hideFilters } = this.state;
    let {
      searchForm,
      resultsType,
      resultsView,
      detailsView,
      totalResults
    } = this.props;
    let { intl } = this.context;

    // only hide filters if there are results and always hide filters when a detail view is visible
    hideFilters = (hideFilters && !!resultsView) || !!detailsView;

    return (
      <div className={styles['search-paneset']}>
        {!!resultsView && (
          <SearchPaneVignette isHidden={hideFilters} onClick={this.toggleFilters} />
        )}

        {!!detailsView && (
          <SearchPaneVignette onClick={this.closePreview} />
        )}

        <SearchPane isHidden={hideFilters}>
          <PaneHeader
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

        {!!resultsView && (
          <ResultsPane>
            <div data-test-eholdings-search-results-header>
              <PaneHeader
                paneTitle={capitalize(resultsType)}
                paneSub={`${intl.formatNumber(totalResults)} search results`}
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
              />
            </div>
            <div className={styles['scrollable-container']}>
              {resultsView}
            </div>
          </ResultsPane>
        )}

        {!!detailsView && (
          <PreviewPane previewType={resultsType}>
            <PaneHeader
              firstMenu={(
                <PaneMenu>
                  <IconButton
                    onClick={this.closePreview}
                    icon="closeX"
                  />
                </PaneMenu>
              )}
            />
            <div className={styles['scrollable-container']}>
              {detailsView}
            </div>
          </PreviewPane>
        )}
      </div>
    );
  }
}

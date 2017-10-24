import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Icon from '@folio/stripes-components/lib/Icon';
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
    location: PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object
    })
  }

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
    this.context.router.history.push({ pathname: '/eholdings', search: this.props.location.search });
  };

  render() {
    let { searchForm, resultsType, resultsView, detailsView, location } = this.props;
    let rootLocation = { pathname: '/eholdings', search: location.search };

    return (
      <div className={styles['search-paneset']}>
        {!!resultsView && (
          <SearchPaneVignette isHidden={this.state.hideFilters} onClick={this.toggleFilters} />
        )}
        {!!detailsView && (
          <SearchPaneVignette onClick={this.closePreview} />
        )}
        <SearchPane isHidden={resultsView && this.state.hideFilters}>
          <PaneHeader
            lastMenu={resultsView ? (
              <PaneMenu><button onClick={this.toggleFilters} className={styles['search-pane-toggle']}>Apply</button></PaneMenu>
            ) : (
              <span />
            )}
          />
          <div className={styles['scrollable-container']}>
            {searchForm}
          </div>
        </SearchPane>
        {!!(resultsView || detailsView) && (
          <ResultsPane>
            <PaneHeader
              paneTitle={capitalize(resultsType)}
              firstMenu={(
                <PaneMenu><button onClick={this.toggleFilters} className={styles['results-pane-search-toggle']}>&larr; Search</button></PaneMenu>
              )}
            />
            <div className={styles['scrollable-container']}>
              {resultsView}
            </div>
          </ResultsPane>
        )}
        {!!detailsView && (
          <PreviewPane previewType={resultsType}>
            <PaneHeader
              firstMenu={(
                <PaneMenu><Link to={rootLocation}><Icon icon="closeX" /></Link></PaneMenu>
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

import React from 'react';
import PropTypes from 'prop-types';
import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import capitalize from 'lodash/capitalize';

import SearchPane from '../search-pane';
import ResultsPane from '../results-pane';
import SearchPaneVignette from '../search-pane-vignette';

import styles from './search-paneset.css';

export default class SearchPaneset extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    searchForm: PropTypes.node,
    hideFilters: PropTypes.bool,
    hasResults: PropTypes.bool,
    resultsType: PropTypes.string
  }

  state = {
    hideFilters: this.props.hideFilters
  };

  componentWillReceiveProps({ hideFilters }) {
    if (hideFilters !== this.state.hideFilters) {
      this.setState({ hideFilters });
    }
  }

  toggleFilters = () => {
    this.setState(({ hideFilters }) => ({
      hideFilters: !hideFilters
    }));
  };

  render() {
    let { searchForm, hasResults, resultsType, children } = this.props;

    return (
      <div className={styles['search-paneset']}>
        <SearchPaneVignette isHidden={this.state.hideFilters} onClick={this.toggleFilters} />
        <SearchPane isHidden={this.state.hideFilters}>
          <PaneHeader
            lastMenu={hasResults ? (
              <PaneMenu><button onClick={this.toggleFilters} className={styles['search-pane-toggle']}>Apply</button></PaneMenu>
            ) : (
              <span></span>
            )}
          />
          <div className={styles['scrollable-container']}>
            {searchForm}
          </div>
        </SearchPane>
        {hasResults && (
          <ResultsPane>
            <PaneHeader
              paneTitle={capitalize(resultsType)}
              firstMenu={(
                <PaneMenu><button onClick={this.toggleFilters} className={styles['results-pane-search-toggle']}>&larr; Search</button></PaneMenu>
              )}
            />
            <div className={styles['scrollable-container']}>
              {children}
            </div>
          </ResultsPane>
        )}
      </div>
    );
  }
}

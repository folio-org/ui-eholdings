import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import {
  searchVendors,
  searchPackages,
  searchTitles,
  clearVendors,
  clearPackages,
  clearTitles
} from '../redux/search';

import SearchPaneset from '../components/search-paneset';
import SearchForm from '../components/search-form';

class SearchRoute extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        searchType: PropTypes.oneOf(['vendors', 'packages', 'titles']).isRequired
      }).isRequired
    }).isRequired,
    search: PropTypes.shape({
      vendors: PropTypes.object.isRequired,
      packages: PropTypes.object.isRequired,
      titles: PropTypes.object.isRequired
    }).isRequired,
    searchVendors: PropTypes.func.isRequired,
    searchPackages: PropTypes.func.isRequired,
    searchTitles: PropTypes.func.isRequired,
    clearVendors: PropTypes.func.isRequired,
    clearPackages: PropTypes.func.isRequired,
    clearTitles: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  };

  componentWillMount() {
    // search using existing query params
    const pathQuery = queryString.parse(this.props.location.search);
    this.performSearch(pathQuery);
  }

  componentWillReceiveProps(nextProps) {
    let {
      location,
      match: { params: { searchType } },
      search: { [searchType]: { content, isPending } }
    } = nextProps;

    let isSameSearchType = searchType === this.props.match.params.searchType;
    let isDifferentSearch = location.search !== this.props.location.search;

    // searching the same set, if the search query is empty, reset results
    if (isSameSearchType && !isPending && isDifferentSearch) {
      const pathQuery = queryString.parse(location.search);

      if (content.length > 0 && !pathQuery.search) {
        if (searchType === 'vendors') this.props.clearVendors();
        if (searchType === 'packages') this.props.clearPackages();
        if (searchType === 'titles') this.props.clearTitles();
      } else if (pathQuery.search) {
        this.performSearch(pathQuery);
      }
    }
  }

  performSearch(query) {
    const {
      location,
      history,
      match: { params: { searchType } },
      search: { [searchType]: { query: lastQuery, isPending } }
    } = this.props;

    const searchQuery = queryString.stringify(query || lastQuery);

    if (!isPending && searchQuery) {
      if (searchType === 'vendors') this.props.searchVendors(query);
      if (searchType === 'packages') this.props.searchPackages(query);
      if (searchType === 'titles') this.props.searchTitles(query);
    }

    // push or replace the current location if the search term has changed
    if (query && searchQuery !== location.search) {
      const url = `${location.pathname}?${searchQuery}`;

      if (query.search === lastQuery.search) {
        history.replace(url);
      } else {
        history.push(url);
      }
    }
  }

  handleSearch = (search) => {
    const {
      match: { params: { searchType } },
      search: { [searchType]: { query } }
    } = this.props;

    this.performSearch({ ...query, search });
  };

  render() {
    const { match: { params: { searchType } }, search } = this.props;
    const { [searchType]: { query, isResolved, isPending, isRejected } } = search;

    const searchTypeLocations = Object.keys(search).reduce((locations, type) => ({
      ...locations,
      [type]: {
        pathname: `/eholdings/search/${type}`,
        search: queryString.stringify(search[type].query)
      }
    }), {});

    return (
      <div data-test-eholdings>
        <SearchPaneset
          hideFilters={!!this.props.location.search}
          hasResults={isPending || isResolved || isRejected}
          resultsType={searchType}
          searchForm={(
            <SearchForm
              searchType={searchType}
              searchString={query.search}
              searchTypeLocations={searchTypeLocations}
              onSearch={this.handleSearch}
            />
          )}
        >
          {this.props.children}
        </SearchPaneset>
      </div>
    );
  }
}

export default connect(
  ({ eholdings: { search } }) => ({ search }),
  {
    searchVendors,
    searchPackages,
    searchTitles,
    clearVendors,
    clearPackages,
    clearTitles
  }
)(SearchRoute);

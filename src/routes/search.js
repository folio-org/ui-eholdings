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

import VendorSearchResultsRoute from './vendor/vendor-search-results';
import PackageSearchResultsRoute from './package/package-search-results';
import TitleSearchResultsRoute from './title/title-search-results';

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

  componentWillReceiveProps({ location, search }) {
    let searchType = this.getSearchType(location);
    if (!searchType) return;

    let { content, isPending } = search[searchType] || {};
    let isSameSearchType = this.getSearchType() === searchType;
    let isDifferentSearch = location.search !== this.props.location.search;

    // searching the same set, if the search query is empty, reset results
    if (isSameSearchType && !isPending && isDifferentSearch) {
      let pathQuery = queryString.parse(location.search);

      if (content.length > 0 && !pathQuery.search) {
        if (searchType === 'vendors') this.props.clearVendors();
        if (searchType === 'packages') this.props.clearPackages();
        if (searchType === 'titles') this.props.clearTitles();
      } else if (pathQuery.search) {
        this.performSearch(pathQuery);
      }
    } else if (!isSameSearchType && !isPending && !content.length) {
      this.performSearch();
    }
  }

  getSearchType(location = this.props.location) {
    let locationQuery = queryString.parse(location.search);
    return locationQuery.searchType;
  }

  performSearch(query) {
    let searchType = this.getSearchType();
    if (!searchType) return;

    let {
      location,
      history,
      search: { [searchType]: { query: lastQuery, isPending } }
    } = this.props;

    // remove the searchType from the actual search
    if (query && query.searchType) {
      delete query.searchType;
    }

    let searchQuery = queryString.stringify(query || lastQuery);
    let searchNotEqual = query && query.search !== lastQuery.search;
    let searchIsEmpty = (!query || !query.search) && !lastQuery.search;

    if (!isPending && (searchNotEqual || searchIsEmpty)) {
      if (searchType === 'vendors') this.props.searchVendors(query);
      if (searchType === 'packages') this.props.searchPackages(query);
      if (searchType === 'titles') this.props.searchTitles(query);
    }

    // push or replace the current location if the search term has changed
    if (query && searchQuery !== location.search) {
      let url = `${location.pathname}?searchType=${searchType}`;
      if (searchQuery) url += `&${searchQuery}`;

      if (query.search === lastQuery.search) {
        history.replace(url);
      } else {
        history.push(url);
      }
    }
  }

  handleSearch = (search) => {
    let searchType = this.getSearchType();
    if (!searchType) return;
    const { search: { [searchType]: { query } } } = this.props;
    this.performSearch({ ...query, search });
  };

  render() {
    let { location, search, children } = this.props;
    let searchType = this.getSearchType();

    if (!searchType) return children;

    let { [searchType]: { query, isResolved, isPending, isRejected } } = search;
    let searchTypeLocations = Object.keys(search).reduce((locations, type) => ({
      ...locations,
      [type]: {
        pathname: location.pathname,
        search: queryString.stringify({
          ...search[type].query,
          searchType: type
        })
      }
    }), {});

    let Results = null;
    if (searchType === 'vendors') {
      Results = VendorSearchResultsRoute;
    } else if (searchType === 'packages') {
      Results = PackageSearchResultsRoute;
    } else if (searchType === 'titles') {
      Results = TitleSearchResultsRoute;
    }

    let noDetails = /^\/eholdings\/?$/.test(location.pathname);

    return (
      <div data-test-eholdings>
        <SearchPaneset
          location={location}
          hideFilters={!!this.props.location.search}
          resultsType={searchType}
          resultsView={(isPending || isResolved || isRejected) && <Results location={location} />}
          detailsView={noDetails ? null : children}
          searchForm={(
            <SearchForm
              searchType={searchType}
              searchString={query.search}
              searchTypeLocations={searchTypeLocations}
              onSearch={this.handleSearch}
            />
          )}
        />
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

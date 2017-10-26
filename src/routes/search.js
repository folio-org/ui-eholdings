import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { connect } from 'react-redux';
import {
  searchVendors,
  searchPackages,
  searchTitles
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
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);

    let { searchType, ...query } = qs.parse(props.location.search);
    let search = props.search[searchType];

    // the current location's query, minus the search type, and the
    // search state specific to this search type
    this.state = { query, searchType, search };
  }

  componentWillMount() {
    // we've landed here with an existing search query
    if (this.state.query.search) {
      this.performSearch();
    }
  }

  componentWillReceiveProps(props) {
    let { searchType, ...query } = qs.parse(props.location.search);
    let search = props.search[searchType];

    let isSameSearchType = searchType === this.state.searchType;
    let isNewQuery = props.location.search !== this.props.location.search;
    let isNewSearch = search !== this.state.search;

    // if there is no search type, do nothing
    if (searchType) {
      // if there isn't a pending search, we're within the same search
      // type as before, and the query has changed, perform the search
      if (!search.isPending && isSameSearchType && isNewQuery) {
        this.performSearch(query);
      }

      // if either the search state or the query has changed, update
      // our component's state
      if (isNewSearch || isNewQuery) {
        this.setState({ query, searchType, search });
      }
    }
  }

  /**
   * Performs a search for an optional query for the current search
   * type with the context bound to this Component
   * @param {Object} query - a query object to pass to the search action
   */
  performSearch = (query = this.state.query) => {
    let { location, history } = this.props;
    let { searchType, search } = this.state;
    let { query: lastQuery, isPending } = search;
    let queryString = qs.stringify(query);

    let isNewSearch = queryString !== qs.stringify(lastQuery);
    let isNewQuery = queryString !== qs.stringify(this.state.query);

    // if there isn't a pending search and the search query has changed,
    // dispatch the search action specific to this search type
    if (!isPending && isNewSearch) {
      if (searchType === 'vendors') this.props.searchVendors(query);
      if (searchType === 'packages') this.props.searchPackages(query);
      if (searchType === 'titles') this.props.searchTitles(query);
    }

    // if the new query is diffent from our location, update the location
    if (isNewQuery) {
      let url = this.buildSearchUrl(location.pathname, queryString);

      // if only the filters have changed, just replace the current location
      if (query.search === lastQuery.search) {
        history.replace(url);
      } else {
        history.push(url);
      }
    }
  }

  /**
   * Build's a url for a specific search type + query
   * @param {String} pathname - the base pathname
   * @param {Object|String} [query] - the query string or object (will be stringified)
   * @param {String} [searchType] - the search type to construct the url for
   * @returns {String} the final url for a search type, including a query
   */
  buildSearchUrl(pathname, query = '', searchType = this.state.searchType) {
    let queryString = typeof query === 'string' ? query : qs.stringify(query);
    let url = `${pathname}?searchType=${searchType}`;

    if (queryString) {
      url += `&${queryString}`;
    }

    return url;
  }

  /**
   * Generates a hash of urls for the various search types and their queries
   * @returns {Object} key value pair of search type urls
   */
  getSearchTypeUrls() {
    let { location, search } = this.props;

    return Object.keys(search).reduce((locations, type) => ({
      [type]: this.buildSearchUrl(location.pathname, search[type].query, type),
      ...locations
    }), {});
  }

  /**
   * Renders the search results component specific to the current search type
   */
  renderResults() {
    let { location } = this.props;
    let { searchType, search } = this.state;
    let { isResolved, isPending, isRejected } = search;

    if (isResolved || isPending || isRejected) {
      if (searchType === 'vendors') {
        return <VendorSearchResultsRoute location={location} />;
      } else if (searchType === 'packages') {
        return <PackageSearchResultsRoute location={location} />;
      } else if (searchType === 'titles') {
        return <TitleSearchResultsRoute location={location} />;
      }
    }

    return null;
  }

  /**
   * If there is a valid search type present in the current location,
   * render the search paneset, otherwise simply render our children
   */
  render() {
    let { location, children } = this.props;
    let { searchType, search } = this.state;

    if (searchType) {
      let hideDetails = /^\/eholdings\/?$/.test(location.pathname);
      let { query } = search;

      return (
        <div data-test-eholdings>
          <SearchPaneset
            location={location}
            hideFilters={!!query.search}
            resultsType={searchType}
            resultsView={this.renderResults()}
            detailsView={!hideDetails && children}
            searchForm={(
              <SearchForm
                searchType={searchType}
                searchString={query.search}
                searchTypeUrls={this.getSearchTypeUrls()}
                onSearch={this.performSearch}
              />
            )}
          />
        </div>
      );
    } else {
      return children;
    }
  }
}

export default connect(
  ({ eholdings: { search } }) => ({ search }),
  {
    searchVendors,
    searchPackages,
    searchTitles
  }
)(SearchRoute);

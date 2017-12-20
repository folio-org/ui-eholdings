import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import Vendor from '../redux/vendor';
import Package from '../redux/package';
import Title from '../redux/title';

import VendorSearchResults from '../components/vendor-search-results';
import PackageSearchResults from '../components/package-search-results';
import TitleSearchResults from '../components/title-search-results';
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
    resolver: PropTypes.object.isRequired,
    searchVendors: PropTypes.func.isRequired,
    searchPackages: PropTypes.func.isRequired,
    searchTitles: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);

    let { searchType, ...query } = qs.parse(props.location.search);
    let results = props.resolver.query(searchType, query);

    // the current location's query, minus the search type, and the
    // resulting records for the current query
    let state = { query, searchType, results };

    // cache queries so we can restore them with the search type buttons
    this.queries = {};

    if (searchType) {
      this.queries[searchType] = query;
    }

    this.state = state;
  }

  componentWillMount() {
    // we've landed here with an existing search query
    if (this.state.query.q) {
      this.performSearch();
    }
  }

  componentWillReceiveProps(props) {
    let { searchType, ...query } = qs.parse(props.location.search);
    let results = props.resolver.query(searchType, query);

    // if there is no search type, do nothing. Otherwise if there
    // _was_ a search type before, remove it from our state
    if (searchType) {
      let isSameSearchType = searchType === this.state.searchType;
      let isNewQuery = props.location.search !== this.props.location.search;
      let isNewSearch = results.request !== this.state.results.request;

      // if there isn't a pending search, we're within the same search
      // type as before, and the query has changed, perform the search
      if (!results.request.isPending && isSameSearchType && isNewQuery) {
        this.performSearch(query);
      }

      // if either the search state or the query has changed,
      // cache the query so it can be restored via the search type
      // buttons, and update our component's state
      if (isNewSearch || isNewQuery) {
        this.queries[searchType] = query;
        this.setState({ query, searchType, results });
      }
    } else if (this.state.searchType) {
      // with no search type, query and results are likely empty
      this.setState({ searchType, query, results });
    }
  }

  /**
   * Performs a search for an optional query for the current search
   * type with the context bound to this Component
   * @param {Object} query - a query object to pass to the search action
   */
  performSearch = (query = this.state.query) => {
    let { location, history } = this.props;
    let { searchType, results } = this.state;
    let { params: lastQuery, isPending } = results.request;
    let queryString = qs.stringify(query);

    let isNewSearch = queryString !== qs.stringify(lastQuery);
    let isNewQuery = queryString !== qs.stringify(this.state.query);

    // if there isn't a pending search and the search query has changed,
    // dispatch the search action specific to this search type
    if (!isPending && (isNewSearch || !results.request.timestamp)) {
      if (searchType === 'vendors') this.props.searchVendors(query);
      if (searchType === 'packages') this.props.searchPackages(query);
      if (searchType === 'titles') this.props.searchTitles(query);
    }

    // if the new query is diffent from our location, update the location
    if (isNewQuery) {
      let url = this.buildSearchUrl(location.pathname, queryString);

      // if only the filters have changed, just replace the current location
      if (query.q === lastQuery.q) {
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
   * Generates a hash of urls for the various search types and their
   * queries from the cache of queries kept by this component
   * @returns {Object} key value pair of search type urls
   */
  getSearchTypeUrls() {
    let { location } = this.props;

    return ['vendors', 'packages', 'titles'].reduce((locations, type) => {
      let lastQuery = this.queries[type] || {};
      let url = this.buildSearchUrl(location.pathname, lastQuery, type);
      return { ...locations, [type]: url };
    }, {});
  }

  /**
   * Renders the search results component specific to the current search type
   */
  renderResults() {
    let { location } = this.props;
    let { searchType, results } = this.state;
    let { isResolved, isPending, isRejected } = results.request;
    let props = { location, results };

    if (isResolved || isPending || isRejected) {
      if (searchType === 'vendors') {
        return <VendorSearchResults {...props} />;
      } else if (searchType === 'packages') {
        return <PackageSearchResults {...props} />;
      } else if (searchType === 'titles') {
        return <TitleSearchResults {...props} />;
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
    let { searchType, results } = this.state;

    if (searchType) {
      let hideDetails = /^\/eholdings\/?$/.test(location.pathname);
      let { params } = results.request;

      return (
        <div data-test-eholdings>
          <SearchPaneset
            location={location}
            hideFilters={!!params.q}
            resultsType={searchType}
            resultsView={this.renderResults()}
            detailsView={!hideDetails && children}
            searchForm={(
              <SearchForm
                searchType={searchType}
                searchString={params.q}
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
  ({ eholdings: { data } }) => ({
    resolver: createResolver(data)
  }), {
    searchVendors: params => Vendor.query(params),
    searchPackages: params => Package.query(params),
    searchTitles: params => Title.query(params)
  }
)(SearchRoute);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import Vendor from '../redux/vendor';
import Package from '../redux/package';
import Title from '../redux/title';

import VendorSearchList from '../components/vendor-search-list';
import PackageSearchList from '../components/package-search-list';
import TitleSearchList from '../components/title-search-list';
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
    searchVendors: PropTypes.func.isRequired,
    searchPackages: PropTypes.func.isRequired,
    searchTitles: PropTypes.func.isRequired,
    resolver: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  static childContextTypes = {
    queryParams: PropTypes.object
  };

  constructor(props) {
    super(props);

    // the current location's query params, minus the search type
    let { searchType, ...params } = qs.parse(props.location.search);
    let results = props.resolver.query(searchType, params);

    // cache queries so we can restore them with the search type buttons
    this.queries = {};

    if (searchType) {
      this.queries[searchType] = params;
    }

    this.state = { params, searchType, results };
  }

  getChildContext() {
    return {
      // provide child components with query params that we've already parsed
      queryParams: {
        searchType: this.state.searchType,
        ...this.state.query
      }
    };
  }
  componentWillReceiveProps(nextProps) {
    let { location, resolver } = nextProps;
    let { searchType, ...params } = qs.parse(location.search);
    let results = resolver.query(searchType, params);

    // cache the query so it can be restored via the search type
    if (searchType) {
      this.queries[searchType] = params;
    }

    // always update the results state
    this.setState({ searchType, params, results });
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
   * Update the url to match new search params
   * @param {Object} params - query param object
   */
  updateURLParams(params) {
    let { location, history } = this.props;

    // if the new query is diffent from our location, update the location
    if (qs.stringify(params) !== qs.stringify(this.state.params)) {
      let url = this.buildSearchUrl(location.pathname, params);

      // if only the filters have changed, just replace the current location
      if (params.q === this.state.params.q) {
        history.replace(url);
      } else {
        history.push(url);
      }
    }
  }

  /**
   * Dispatches a search action specific to the current search type
   * @param {Object} params - search params for the action
   */
  search(params) {
    let { searchType } = this.state;
    if (searchType === 'vendors') this.props.searchVendors(params);
    if (searchType === 'packages') this.props.searchPackages(params);
    if (searchType === 'titles') this.props.searchTitles(params);
  }

  /**
   * Handles submitting the search form and updates the URL
   * @param {Object} params - query param object
   */
  handleSearch = (params) => {
    this.updateURLParams(params);
    this.search(params);
  };

  /**
   * Handles updating the page query param in our URL. The
   * QueryList component will trigger this method when scrolling
   * between pages
   * @param {Number} page - the page number the QueryList component
   * has been scrolled to
   */
  handlePage = (page) => {
    let { params } = this.state;
    this.updateURLParams({ ...params, page });
  };

  /**
   * Uses the current params to search for another page
   * @param {Number} page - the page number
   */
  fetchPage = (page) => {
    let { params } = this.state;
    this.search({ ...params, page });
  };

  /**
   * Renders the search component specific to the current search type
   */
  renderResults() {
    let { searchType, params, results } = this.state;

    let props = {
      params,
      location: this.props.location,
      collection: results,
      fetch: this.fetchPage,
      onPage: this.handlePage
    };

    if (params.q) {
      if (searchType === 'vendors') {
        return <VendorSearchList {...props} />;
      } else if (searchType === 'packages') {
        return <PackageSearchList {...props} />;
      } else if (searchType === 'titles') {
        return <TitleSearchList {...props} />;
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
    let { searchType, params, results } = this.state;

    if (searchType) {
      let hideDetails = /^\/eholdings\/?$/.test(location.pathname);

      return (
        <div data-test-eholdings>
          <SearchPaneset
            location={location}
            hideFilters={!!params.q}
            resultsType={searchType}
            resultsView={this.renderResults()}
            detailsView={!hideDetails && children}
            totalResults={results.length}
            searchForm={(
              <SearchForm
                searchType={searchType}
                searchString={params.q}
                searchTypeUrls={this.getSearchTypeUrls()}
                onSearch={this.handleSearch}
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

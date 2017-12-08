import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { connect } from 'react-redux';

import { createResolver } from '../redux';
import Vendor from '../redux/vendor';
import Package from '../redux/package';
import Title from '../redux/title';

import VendorSearch from '../components/vendor-search';
import PackageSearch from '../components/package-search';
import TitleSearch from '../components/title-search';
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
    children: PropTypes.node.isRequired
  };

  static childContextTypes = {
    queryParams: PropTypes.object
  };

  constructor(props) {
    super(props);

    // the current location's query params, minus the search type
    let { searchType, ...params } = qs.parse(props.location.search);

    // cache queries so we can restore them with the search type buttons
    this.queries = {};

    if (searchType) {
      this.queries[searchType] = params;
    }

    this.state = { params, searchType };
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
    let { location } = nextProps;
    let { searchType, ...params } = qs.parse(location.search);

    // cache the query so it can be restored via the search type
    if (searchType) {
      this.queries[searchType] = params;
    }

    let newType = searchType !== this.state.searchType;
    let newSearch = qs.stringify(params) !== qs.stringify(this.state.query);

    // if the new query params are diffent from our location query params,
    // update our state
    if (newType || newSearch) {
      this.setState({ searchType, params });
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
   * Update the url to match new seaerch params
   * @param {Object} params - query param object
   */
  performSearch = (params = this.state.params) => {
    let { location, history } = this.props;

    // if the new query is diffent from our location, update the location
    if (qs.stringify(params) !== qs.stringify(this.state.query)) {
      let url = this.buildSearchUrl(location.pathname, params);

      // if only the filters have changed, just replace the current location
      if (params.q === this.state.params.q) {
        history.replace(url);
      } else {
        history.push(url);
      }
    }
  };

  /**
   * Dispatch the search action specific to this search type for a page offset
   * @param {Number} offset - the page offset
   */
  fetchPage = (offset) => {
    let { searchType, params } = this.state;
    let pageParams = { ...params, offset };

    if (searchType === 'vendors') this.props.searchVendors(pageParams);
    if (searchType === 'packages') this.props.searchPackages(pageParams);
    if (searchType === 'titles') this.props.searchTitles(pageParams);
  };

  /**
   * Renders the search component specific to the current search type
   */
  renderResults() {
    let { searchType, params } = this.state;
    let { location } = this.props;

    let props = { location, params, fetch: this.fetchPage };

    if (params.q) {
      if (searchType === 'vendors') {
        return <VendorSearch {...props} />;
      } else if (searchType === 'packages') {
        return <PackageSearch {...props} />;
      } else if (searchType === 'titles') {
        return <TitleSearch {...props} />;
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
    let { searchType, params } = this.state;

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
            // totalResults={meta.totalResults}
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
  null, {
    searchVendors: params => Vendor.query(params),
    searchPackages: params => Package.query(params),
    searchTitles: params => Title.query(params)
  }
)(SearchRoute);

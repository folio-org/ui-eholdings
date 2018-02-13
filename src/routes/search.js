import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { qs } from '../components/utilities';
import { createResolver } from '../redux';
import Provider from '../redux/provider';
import Package from '../redux/package';
import Title from '../redux/title';

import ProviderSearchList from '../components/provider-search-list';
import PackageSearchList from '../components/package-search-list';
import TitleSearchList from '../components/title-search-list';
import TitleSearchFilters from '../components/title-search-filters';
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
    searchProviders: PropTypes.func.isRequired,
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
        ...this.state.params
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

    // always update the results state
    this.setState({ searchType, params });
  }

  /**
   * Uses the resolver to get a results collection for the current
   * search type and search params (including the page)
   * @returns {Collection} a collection instance
   */
  getResults() {
    let { resolver } = this.props;
    let { searchType, params } = this.state;
    let { offset = 0, ...queryParams } = params;
    let page = Math.floor(offset / 25) + 1;

    return resolver.query(searchType, { ...queryParams, page });
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

    return ['providers', 'packages', 'titles'].reduce((locations, type) => {
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

    // if the new query is different from our location, update the location
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
    if (searchType === 'providers') this.props.searchProviders(params);
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
   * Handles updating the pffset query param in our URL. The
   * QueryList component will trigger this method when scrolling
   * @param {Number} offset - the read offset the QueryList component
   * has been scrolled to
   */
  handleOffset = (offset) => {
    let { params } = this.state;
    this.updateURLParams({ ...params, offset });
  };

  /**
   * Uses the current params to search for another page
   * @param {Number} page - the page number
   */
  fetchPage = (page) => {
    // eslint-disable-next-line no-unused-vars
    let { offset, ...params } = this.state.params;
    this.search({ ...params, page });
  };

  /**
   * Returns the component that is responsible for rendering filters
   * for the current searchType
   */
  getFiltersComponent() {
    let { searchType } = this.state;

    if (searchType === 'titles') {
      return TitleSearchFilters;
    }

    return null;
  }

  /**
   * Renders the search component specific to the current search type
   */
  renderResults() {
    let { searchType, params } = this.state;

    let props = {
      params,
      location: this.props.location,
      collection: this.getResults(),
      onUpdateOffset: this.handleOffset,
      fetch: this.fetchPage
    };

    if (params.q) {
      if (searchType === 'providers') {
        return <ProviderSearchList {...props} />;
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
    let { searchType, params } = this.state;

    if (searchType) {
      let hideDetails = /^\/eholdings\/?$/.test(location.pathname);
      let results = this.getResults();

      return (
        <div data-test-eholdings>
          <SearchPaneset
            location={location}
            hideFilters={!!params.q}
            resultsType={searchType}
            resultsView={this.renderResults()}
            detailsView={!hideDetails && children}
            totalResults={results.length}
            isLoading={!results.hasLoaded}
            searchForm={(
              <SearchForm
                searchType={searchType}
                searchString={params.q}
                searchTypeUrls={this.getSearchTypeUrls()}
                filtersComponent={this.getFiltersComponent()}
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
    searchProviders: params => Provider.query(params),
    searchPackages: params => Package.query(params),
    searchTitles: params => Title.query(params)
  }
)(SearchRoute);

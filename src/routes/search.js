import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';
import TitleManager from '@folio/stripes-core/src/components/TitleManager';

import { qs } from '../components/utilities';
import { createResolver } from '../redux';
import Provider from '../redux/provider';
import Package from '../redux/package';
import Title from '../redux/title';

import ProviderSearchList from '../components/provider-search-list';
import PackageSearchList from '../components/package-search-list';
import TitleSearchList from '../components/title-search-list';
import SearchPaneset from '../components/search-paneset';
import SearchForm from '../components/search-form';

class SearchRoute extends Component { // eslint-disable-line react/no-deprecated
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      location: PropTypes.object
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      }).isRequired
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
    this.path = {};

    if (searchType) {
      this.queries[searchType] = params;
      this.path[searchType] = props.location.pathname;
    }

    this.state = {
      hideDetails: /^\/eholdings\/?$/.test(props.location.pathname),
      searchType,
      params,
      searchString: params.q,
      searchFilter: params.filter,
      sort: params.sort
    };
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
    let { location, match } = nextProps;
    let { searchType, ...params } = qs.parse(location.search);
    let hideDetails = /^\/eholdings\/?$/.test(location.pathname);
    let shouldFocusItem = null;

    // cache the query so it can be restored via the search type
    if (searchType) {
      this.queries[searchType] = params;
      this.path[searchType] = location.pathname;
    }

    // when details are not visible, we need to focus the last active
    // list item as determined by the `id` URL param
    if (hideDetails && this.props.match.params.id !== match.params.id) {
      shouldFocusItem = this.props.match.params.id || null;
    }

    // always update the results state
    this.setState({
      hideDetails,
      shouldFocusItem,
      searchType,
      params,
      searchString: params.q,
      searchFilter: params.filter,
      sort: params.sort
    });
  }

  handleSearchChange = (searchString) => {
    this.setState({ searchString });
  }

  handleFilterChange = (sort, searchFilter) => {
    this.setState({ sort, searchFilter }, () => this.handleSearch());
  }

  /**
   * Transforms UI params into search params
   * @param {Object} parms - query param object
   */

  transformQueryParams(params) {
    let { searchType } = this.state;
    if (searchType === 'titles') {
      let { q, searchfield = 'name', filter = {}, ...searchParams } = params;
      if (searchfield === 'title') { searchfield = 'name'; }
      let searchfilter = { ...filter, [searchfield]: q };
      return { ...searchParams, filter: searchfilter };
    } else { return params; }
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
    let searchParams = this.transformQueryParams(queryParams);
    let page = Math.floor(offset / 25) + 1;

    return resolver.query(searchType, {
      filter: undefined,
      ...searchParams,
      page
    });
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
    return ['providers', 'packages', 'titles'].reduce((locations, type) => {
      let lastQuery = this.queries[type] || {};
      let lastPath = this.path[type] || '/eholdings';
      let url = this.buildSearchUrl(lastPath, lastQuery, type);
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

      // if new query is different from current query this will close detail pane
      if (params.q !== this.state.params.q) {
        url = this.buildSearchUrl('/eholdings', params);
      }

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
    let searchParams = this.transformQueryParams(params);
    let { searchType } = this.state;
    if (searchType === 'providers') this.props.searchProviders(searchParams);
    if (searchType === 'packages') this.props.searchPackages(searchParams);
    if (searchType === 'titles') this.props.searchTitles(searchParams);
  }

  /**
   * Handles submitting the search form and updates the URL
   * @param {Object} params - query param object
   */
  handleSearch = () => {
    let params = {
      q: this.state.searchString,
      filter: this.state.searchFilter,
      sort: this.state.sort
    };

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
   * Renders the search component specific to the current search type
   */
  renderResults() {
    let { searchType, params, shouldFocusItem } = this.state;
    let { match: { params: { id } } } = this.props;

    let props = {
      params,
      activeId: id,
      shouldFocusItem,
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
    let {
      searchType,
      params,
      hideDetails,
      searchString,
      searchFilter,
      sort
    } = this.state;

    if (searchType) {
      let results = this.getResults();

      return (
        <TitleManager record={capitalize(searchType)}>
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
                  searchString={searchString}
                  searchFilter={searchFilter}
                  searchfield={params.searchfield}
                  sort={sort}
                  searchTypeUrls={this.getSearchTypeUrls()}
                  onSearch={this.handleSearch}
                  isLoading={!!params.q && !results.hasLoaded}
                  handleFilterChange={this.handleFilterChange}
                  handleSearchChange={this.handleSearchChange}
                />
              )}
            />
          </div>
        </TitleManager>
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

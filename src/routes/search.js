import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { FormattedMessage } from 'react-intl';
import { TitleManager } from '@folio/stripes/core';

import { qs, transformQueryParams } from '../components/utilities';
import { createResolver } from '../redux';
import Provider from '../redux/provider';
import Package from '../redux/package';
import Title from '../redux/title';
import Tag from '../redux/tag';

import ProviderSearchList from '../components/provider-search-list';
import PackageSearchList from '../components/package-search-list';
import TitleSearchList from '../components/title-search-list';
import SearchPaneset from '../components/search-paneset';
import SearchForm from '../components/search-form';
import { searchTypes } from '../constants';
import { filterCountFromQuery } from '../components/search-modal/search-modal';

class SearchRoute extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    getTags: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    resolver: PropTypes.object.isRequired,
    searchPackages: PropTypes.func.isRequired,
    searchProviders: PropTypes.func.isRequired,
    searchTitles: PropTypes.func.isRequired,
    tagsModel: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    // the current location's query params, minus the search type
    const { searchType, ...params } = qs.parse(props.location.search);

    // cache queries so we can restore them with the search type buttons
    this.queries = {};
    this.path = {};

    props.getTags();

    if (searchType) {
      this.queries[searchType] = params;
      this.path[searchType] = props.location.pathname;
    }

    this.state = {
      hideDetails: /^\/eholdings\/?$/.test(props.location.pathname),
      searchType,
      params,
      sort: params.sort,
      searchString: params.q,
      searchFilter: params.filter,
      searchField: params.searchfield,
      hideFilters: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { location, match } = nextProps;
    const { searchType, ...params } = qs.parse(location.search);
    const hideDetails = /^\/eholdings\/?$/.test(location.pathname);
    let shouldFocusItem = null;

    if (hideDetails && match.params.id !== (prevState.match && prevState.match.params.id)) {
      shouldFocusItem = prevState.match.params.id || null;
    }
    // update searchstring state only when it actually changes in the location instead of updating it each time on
    // input to text field. This eliminates re-rendering of the text field on each keyboard in and solves problem
    // stated in https://issues.folio.org/browse/UIEH-558
    if (!isEqual(location, prevState.location)) {
      return {
        location,
        match,
        searchType,
        params,
        hideDetails,
        shouldFocusItem,
        sort: params.sort,
        searchFilter: params.filter,
        searchField: params.searchfield,
        searchString: params.q
      };
    }
    return null;
  }

  componentDidUpdate() {
    // cache the query so it can be restored via the search type
    if (this.state.searchType) {
      this.queries[this.state.searchType] = this.state.params;
      this.path[this.state.searchType] = this.state.location.pathname;
    }
  }

  handleSearchChange = (searchString) => {
    this.setState({ searchString });
  }

  handleFilterChange = (sort, searchFilter) => {
    this.setState({ sort, searchFilter }, () => this.handleSearch());
  }

  handleTagFilterChange = (searchFilter) => {
    this.setState({ searchFilter, searchString: '' }, () => this.handleSearch());
  }

  handleSearchFieldChange = searchField => {
    this.setState({ searchField });
  }

  updateFilters = fn => this.setState(({ hideFilters }) => ({
    hideFilters: fn(hideFilters)
  }));

  /**
   * Uses the resolver to get a results collection for the current
   * search type and search params (including the page)
   * @returns {Collection} a collection instance
   */
  getResults() {
    const { resolver } = this.props;
    const { searchType, params } = this.state;
    const { offset = 0, ...queryParams } = params;
    const searchParams = transformQueryParams(searchType, queryParams);
    const page = Math.floor(offset / 25) + 1;

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
    const queryString = typeof query === 'string' ? query : qs.stringify(query);
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
    const searchTypesArr = [
      searchTypes.PROVIDERS,
      searchTypes.PACKAGES,
      searchTypes.TITLES
    ];
    return searchTypesArr.reduce((locations, type) => {
      const lastQuery = this.queries[type] || {};
      const lastPath = this.path[type] || '/eholdings';
      const url = this.buildSearchUrl(lastPath, lastQuery, type);
      return { ...locations, [type]: url };
    }, {});
  }

  /**
   * Update the url to match new search params
   * @param {Object} params - query param object
   */
  updateURLParams(params) {
    const { location, history } = this.props;

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
    const { searchType } = this.state;
    const searchParams = transformQueryParams(searchType, params);
    if (searchType === searchTypes.PROVIDERS) this.props.searchProviders(searchParams);
    if (searchType === searchTypes.PACKAGES) this.props.searchPackages(searchParams);
    if (searchType === searchTypes.TITLES) this.props.searchTitles(searchParams);
  }

  /**
   * Handles submitting the search form and updates the URL
   * @param {Object} params - query param object
   */
  handleSearch = () => {
    const params = {
      q: this.state.searchString,
      filter: this.state.searchFilter,
      sort: this.state.sort,
      searchfield: this.state.searchField
    };

    this.updateURLParams(params);
  };

  /**
   * Handles updating the pffset query param in our URL. The
   * QueryList component will trigger this method when scrolling
   * @param {Number} offset - the read offset the QueryList component
   * has been scrolled to
   */
  handleOffset = (offset) => {
    const { params } = this.state;
    this.updateURLParams({ ...params, offset });
  };

  /**
   * Uses the current params to search for another page
   * @param {Number} page - the page number
   */
  fetchPage = (page) => {
    // eslint-disable-next-line no-unused-vars
    const { offset, ...params } = this.state.params;
    this.search({ ...params, page });
  };

  notFoundMessage = (searchType) => {
    const { params } = this.state;
    let idWithQuery; let idnoQuery;

    if (searchType === searchTypes.PROVIDERS) {
      idWithQuery = 'ui-eholdings.provider.resultsNotFoundForQuery';
      idnoQuery = 'ui-eholdings.provider.resultsNotFound';
    } else if (searchType === searchTypes.PACKAGES) {
      idWithQuery = 'ui-eholdings.package.resultsNotFoundForQuery';
      idnoQuery = 'ui-eholdings.package.resultsNotFound';
    } else if (searchType === searchTypes.TITLES) {
      idWithQuery = 'ui-eholdings.title.resultsNotFoundForQuery';
      idnoQuery = 'ui-eholdings.title.resultsNotFound';
    }
    return params.q ? (
      <FormattedMessage
        id={idWithQuery}
        values={{ query: params.q }}
      />
    ) : (
      <FormattedMessage
        id={idnoQuery}
      />
    );
  };


  /**
   * Renders the search component specific to the current search type
   */
  renderResults() {
    const { searchType, params, shouldFocusItem } = this.state;
    const { history, location, match: { params: { id } } } = this.props;

    const props = {
      params,
      activeId: id,
      shouldFocusItem,
      location: this.props.location,
      collection: this.getResults(),
      onUpdateOffset: this.handleOffset,
      fetch: this.fetchPage,
      onClickItem: (detailUrl) => {
        history.push({
          pathname: detailUrl,
          search: location.search,
          state: { eholdings: true }
        });
      },
      notFoundMessage: this.notFoundMessage(searchType)
    };

    const {
      filter = {}
    } = params;


    const { tags = '' } = filter;


    if (params.q || tags) {
      if (searchType === searchTypes.PROVIDERS) {
        return <ProviderSearchList {...props} />;
      } else if (searchType === searchTypes.PACKAGES) {
        return <PackageSearchList {...props} />;
      } else if (searchType === searchTypes.TITLES) {
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
    const { children, history, location, tagsModel } = this.props;
    const {
      searchType,
      params,
      hideDetails,
      sort,
      searchString,
      searchFilter,
      searchField,
      hideFilters
    } = this.state;

    if (searchType) {
      const results = this.getResults();
      const filterCount = filterCountFromQuery({
        sort: params.sort,
        q: params.q,
        filter: params.filter
      });

      return (
        <FormattedMessage id={`ui-eholdings.search.searchType.${searchType}`}>
          {label => (
            <TitleManager record={label}>
              <div data-test-eholdings>
                <SearchPaneset
                  filterCount={filterCount}
                  hideFilters={hideFilters}
                  resultsType={searchType}
                  resultsLabel={label}
                  resultsView={this.renderResults()}
                  detailsView={!hideDetails && children}
                  totalResults={results.length}
                  isLoading={!results.hasLoaded}
                  updateFilters={this.updateFilters}
                  location={location}
                  onClosePreview={() => history.push({
                    pathname: '/eholdings',
                    search: location.search,
                    state: { eholdings: true }
                  })}
                  searchForm={(
                    <SearchForm
                      sort={sort}
                      searchType={searchType}
                      searchString={searchString}
                      searchFilter={searchFilter}
                      searchField={searchField}
                      tagsModel={tagsModel}
                      searchTypeUrls={this.getSearchTypeUrls()}
                      isLoading={!!params.q && !results.hasLoaded}
                      onSearch={this.handleSearch}
                      onSearchFieldChange={this.handleSearchFieldChange}
                      onFilterChange={this.handleFilterChange}
                      onSearchChange={this.handleSearchChange}
                      onTagFilterChange={this.handleTagFilterChange}
                    />
                  )}
                />
              </div>
            </TitleManager>
          )}
        </FormattedMessage>
      );
    } else {
      return children;
    }
  }
}

export default connect(
  ({ eholdings: { data } }) => {
    const resolver = createResolver(data);
    return {
      tagsModel: resolver.query('tags'),
      resolver
    };
  }, {
    searchProviders: params => Provider.query(params),
    searchPackages: params => Package.query(params),
    searchTitles: params => Title.query(params),
    getTags: () => Tag.query()
  }
)(SearchRoute);

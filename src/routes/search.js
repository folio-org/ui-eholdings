import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { searchVendors, searchPackages, searchTitles } from '../redux/search';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
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
    children: PropTypes.node.isRequired
  };

  componentWillMount() {
    // search using existing query params
    const pathQuery = queryString.parse(this.props.location.search);
    this.performSearch(pathQuery);
  }

  performSearch(query) {
    const {
      location,
      history,
      match: { params: { searchType }},
      search: {[searchType]: { query:lastQuery, isLoading }}
    } = this.props;

    const searchQuery = queryString.stringify(query || lastQuery);
    const lastSearchQuery = queryString.stringify(lastQuery);

    if (!isLoading && searchQuery && searchQuery !== lastSearchQuery) {
      if (searchType === 'vendors') this.props.searchVendors(query);
      if (searchType === 'packages') this.props.searchPackages(query);
      if (searchType === 'titles') this.props.searchTitles(query);
    }

    // push or replace the current location if the search term has changed
    if (query && searchQuery !== location.search) {
      const url = `${location.pathname}?${searchQuery}`;

      if (query.string === lastQuery.string) {
        history.replace(url);
      } else {
        history.push(url);
      }
    }
  }

  handleSearch = (search) => {
    const {
      match: { params: { searchType }},
      search: {[searchType]: { query }}
    } = this.props;

    this.performSearch({ ...query, search });
  };

  render() {
    const { match: { params: { searchType }}, search } = this.props;
    const {[searchType]: { query }} = search;

    const searchTypeLocations = Object.keys(search).reduce((locations, type) => ({
      ...locations, [type]: {
        pathname: `/eholdings/search/${type}`,
        search: queryString.stringify(search[type].query)
      }
    }), {});

    return (
      <div data-test-eholdings>
        <Paneset>
          <Pane defaultWidth="100%" header={(
            <SearchForm
                searchType={searchType}
                searchString={query.search}
                searchTypeLocations={searchTypeLocations}
                onSearch={this.handleSearch}/>
          )}>
            {this.props.children}
          </Pane>
        </Paneset>
      </div>
    );
  }
}

export default connect(
  ({ eholdings: { search }}) => ({ search }),
  { searchVendors, searchPackages, searchTitles }
)(SearchRoute);

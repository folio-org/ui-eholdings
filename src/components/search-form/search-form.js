import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import capitalize from 'lodash/capitalize';
import isEqual from 'lodash/isEqual';
import {
  Button,
  SearchField
} from '@folio/stripes-components';
import ProviderSearchFilters from '../provider-search-filters';
import PackageSearchFilters from '../package-search-filters';
import TitleSearchFilters from '../title-search-filters';

import styles from './search-form.css';

const validSearchTypes = ['providers', 'packages', 'titles'];

const searchableIndexes = [
  { label: 'Title', value: 'title' },
  { label: 'ISSN/ISBN', value: 'isxn' },
  { label: 'Publisher', value: 'publisher' },
  { label: 'Subject', value: 'subject' }
];

export default class SearchForm extends Component {
  static propTypes = {
    searchType: PropTypes.oneOf(validSearchTypes).isRequired,
    searchTypeUrls: PropTypes.shape({
      providers: PropTypes.string.isRequired,
      packages: PropTypes.string.isRequired,
      titles: PropTypes.string.isRequired
    }),
    onSearch: PropTypes.func.isRequired,
    searchString: PropTypes.string,
    filter: PropTypes.object,
    searchfield: PropTypes.string,
    sort: PropTypes.string,
    displaySearchTypeSwitcher: PropTypes.bool,
    displaySearchButton: PropTypes.bool,
    isLoading: PropTypes.bool,
    onFilterChange: PropTypes.func,
    onSearchQueryChange: PropTypes.func
  };

  static defaultProps = {
    displaySearchTypeSwitcher: true,
    displaySearchButton: true
  };

  static getDerivedStateFromProps({ searchString = '', filter = {}, searchfield, sort }, state) {
    const newSearchfield = searchfield !== state.searchfield ? searchfield : state.searchfield;
    const newSearchString = searchString !== state.searchString ? searchString : state.searchString;
    const newSort = sort !== state.sort ? sort : state.sort;
    let newFilter = state.filter;

    if (sort) {
      const displayfilter = { ...filter, sort };
      if (!isEqual(displayfilter, state.filter)) {
        newFilter = displayfilter;
      }
    } else if (!isEqual(filter, state.filter)) {
      newFilter = filter;
    }

    return {
      filter: newFilter,
      searchfield: newSearchfield,
      searchString: newSearchString,
      sort: newSort,
    };
  }

  state = {
    searchString: this.props.searchString || '',
    filter: this.props.filter || {},
    searchfield: this.props.searchfield || 'title', // last attr actually used in getDerivedStateFromProps
    sort: this.props.sort || 'relevance' // eslint-disable-line react/no-unused-state
  };

  submitSearch = () => {
    let { sort, ...searchfilter } = this.state.filter;

    this.props.onSearch({
      q: this.state.searchString,
      filter: searchfilter,
      searchfield: this.state.searchfield,
      sort
    });
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.submitSearch();
  };

  handleChangeSearch = (e) => {
    this.setState({ searchString: e.target.value }, () => {
      if (this.props.onSearchQueryChange) {
        this.props.onSearchQueryChange(
          this.state.searchString
        );
      }
    });
  };

  handleClearSearch = () => {
    this.setState({ searchString: '' });

    if (this.props.onSearchQueryChange) {
      this.props.onSearchQueryChange(
        this.state.searchString
      );
    }
  };

  handleUpdateFilter = (filter) => {
    this.setState({ filter }, () => {
      let { sort, ...searchfilter } = this.state.filter;

      if (this.props.onFilterChange) {
        this.props.onFilterChange({
          q: this.state.searchString,
          filter: searchfilter,
          searchfield: this.state.searchfield,
          sort
        });
      }
    });
  };

  handleChangeIndex = (e) => {
    this.setState({ searchfield: e.target.value });
  };

  /**
   * Returns the component that is responsible for rendering filters
   * for the current searchType
   */
  getFiltersComponent = (searchType) => {
    if (searchType === 'titles') {
      return TitleSearchFilters;
    } else if (searchType === 'packages') {
      return PackageSearchFilters;
    } else if (searchType === 'providers') {
      return ProviderSearchFilters;
    }

    return null;
  };

  render() {
    const {
      searchType,
      searchTypeUrls,
      displaySearchTypeSwitcher,
      isLoading,
      displaySearchButton
    } = this.props;
    const { searchString, filter, searchfield } = this.state;
    const Filters = this.getFiltersComponent(searchType);

    return (
      <div className={styles['search-form-container']} data-test-search-form={searchType}>
        { displaySearchTypeSwitcher && (
          <div className={styles['search-switcher']} data-test-search-form-type-switcher>
            {validSearchTypes.map(type => (
              <Link
                key={type}
                title={`search ${type}`}
                to={searchTypeUrls[type]}
                className={searchType === type ? styles['is-active'] : undefined}
                data-test-search-type-button={type}
              >
                {capitalize(type)}
              </Link>
            ))}
          </div>
        )}
        <form onSubmit={this.handleSearchSubmit}>
          {(searchType === 'titles') ? (
            <div data-test-title-search-field>
              <SearchField
                name="search"
                searchableIndexes={searchableIndexes}
                selectedIndex={searchfield}
                onChangeIndex={this.handleChangeIndex}
                onChange={this.handleChangeSearch}
                onClear={this.handleClearSearch}
                value={searchString}
                placeholder={`Search ${searchType}...`}
                ariaLabel={`Search ${searchType}`}
                loading={isLoading}
              />
            </div>
          ) : (
            <div data-test-search-field>
              <SearchField
                name="search"
                onChange={this.handleChangeSearch}
                onClear={this.handleClearSearch}
                value={searchString}
                placeholder={`Search ${searchType}...`}
                ariaLabel={`Search ${searchType}`}
                loading={isLoading}
              />
            </div>
          )}
          { displaySearchButton && (
            <Button
              type="submit"
              buttonStyle="primary"
              fullWidth
              disabled={!searchString}
              data-test-search-submit
            >
              Search
            </Button>
          )}
          {Filters && (
            <div>
              <hr />
              <Filters
                activeFilters={filter}
                onUpdate={this.handleUpdateFilter}
              />
            </div>
          )}
        </form>
      </div>
    );
  }
}

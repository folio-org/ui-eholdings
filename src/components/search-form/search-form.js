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
    searchfield: PropTypes.string,
    searchFilter: PropTypes.object.isRequired, // TODO: shape it
    sort: PropTypes.string.isRequired,
    displaySearchTypeSwitcher: PropTypes.bool,
    displaySearchButton: PropTypes.bool,
    isLoading: PropTypes.bool,
    handleSearchChange: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    displaySearchTypeSwitcher: true,
    displaySearchButton: true
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.props.onSearch();
  };

  handleChangeSearch = (e) => {
    this.props.handleSearchChange(e.target.value);
  };

  handleClearSearch = () => {
    this.props.handleSearchChange('');
  };

  handleUpdateFilter = (filter) => {
    let { sort, ...searchFilter } = filter;

    this.props.handleFilterChange(sort, searchFilter);
  };

  // TODO, this one? hmmm
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
    let {
      searchType,
      searchTypeUrls,
      displaySearchTypeSwitcher,
      isLoading,
      displaySearchButton,
      searchfield,
      searchFilter,
      searchString,
      sort
    } = this.props;
    let Filters = this.getFiltersComponent(searchType);
    // sort is treated separately from the rest of the filters on submit,
    // but treated together when rendering the filters.
    let combinedFilters = { sort, ...searchFilter };

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
                activeFilters={combinedFilters}
                onUpdate={this.handleUpdateFilter}
              />
            </div>
          )}
        </form>
      </div>
    );
  }
}

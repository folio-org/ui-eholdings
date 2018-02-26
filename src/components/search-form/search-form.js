import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import SearchField from '@folio/stripes-components/lib/structures/SearchField';
import capitalize from 'lodash/capitalize';
import isEqual from 'lodash/isEqual';
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
    }).isRequired,
    filtersComponent: PropTypes.func,
    onSearch: PropTypes.func.isRequired,
    searchString: PropTypes.string,
    filter: PropTypes.object,
    searchfield: PropTypes.string
  };

  state = {
    searchString: this.props.searchString || '',
    filter: this.props.filter || {},
    searchfield: this.props.searchfield || 'title'
  };

  componentWillReceiveProps({ searchString = '', filter = {}, searchfield }) {
    if (searchString !== this.state.searchString) {
      this.setState({ searchString });
    }

    if (!isEqual(filter, this.state.filter)) {
      this.setState({ filter });
    }

    if (searchfield !== this.state.searchfield) {
      this.setState({ searchfield });
    }
  }

  handleSearchSubmit = (e) => {
    e.preventDefault();

    this.props.onSearch({
      q: this.state.searchString,
      filter: this.state.filter,
      searchfield: this.state.searchfield
    });
  };

  handleChangeSearch = (e) => {
    this.setState({ searchString: e.target.value });
  };

  handleUpdateFilter = (filter) => {
    this.setState({ filter });
  };

  handleChangeIndex = (e) => {
    this.setState({ searchfield: e.target.value });
  };

  render() {
    const { searchType, searchTypeUrls, filtersComponent: Filters } = this.props;
    const { searchString, filter, searchfield } = this.state;

    return (
      <div className={styles['search-form-container']} data-test-search-form={searchType}>
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
        <form onSubmit={this.handleSearchSubmit}>
          {(searchType === 'titles') ? (
            <div data-test-title-search-field>
              <SearchField
                name="search"
                id="eholdings-title-search-searchfield"
                searchableIndexes={searchableIndexes}
                selectedIndex={searchfield}
                onChangeIndex={this.handleChangeIndex}
                onChange={this.handleChangeSearch}
                onClear={this.onClearSearch}
                value={searchString}
                placeholder={`Search for ${searchType}...`}
              />
            </div>
          ) : (
            <input
              className={styles['search-input']}
              type="search"
              name="search"
              value={searchString}
              placeholder={`Search for ${searchType}...`}
              onChange={this.handleChangeSearch}
              data-test-search-field
            />
          )
          }
          <button
            className={styles['search-submit']}
            type="submit"
            disabled={!searchString}
            data-test-search-submit
          >
            Search
          </button>

          <hr />

          {Filters && (
            <Filters
              activeFilters={filter}
              onUpdate={this.handleUpdateFilter}
            />
          )}
        </form>
      </div>
    );
  }
}

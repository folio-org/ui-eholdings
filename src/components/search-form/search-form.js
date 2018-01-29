import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import capitalize from 'lodash/capitalize';
import styles from './search-form.css';

const validSearchTypes = ['providers', 'packages', 'titles'];

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
    searchString: PropTypes.string
  };

  state = {
    searchString: this.props.searchString || '',
    filter: ''
  };

  componentWillReceiveProps({ searchString = '' }) {
    if (searchString !== this.state.searchString) {
      this.setState({ searchString });
    }
  }

  handleSearchSubmit = (e) => {
    e.preventDefault();

    this.props.onSearch({
      q: this.state.searchString,
      filter: this.state.filter
    });
  };

  handleChangeSearch = (e) => {
    this.setState({ searchString: e.target.value });
  };

  handleUpdateFilter = (filter) => {
    this.setState({ filter });
  };

  render() {
    const { searchType, searchTypeUrls, filtersComponent: Filters } = this.props;
    const { searchString, filter } = this.state;

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
          <input
            className={styles['search-input']}
            type="search"
            name="search"
            value={searchString}
            placeholder={`Search for ${searchType}...`}
            onChange={this.handleChangeSearch}
            data-test-search-field
          />
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
              filter={filter}
              onUpdate={this.handleUpdateFilter}
            />
          )}
        </form>
      </div>
    );
  }
}

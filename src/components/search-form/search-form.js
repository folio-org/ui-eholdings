import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavLink from 'react-router-dom/NavLink';
import capitalize from 'lodash/capitalize';
import styles from './search-form.css';

export default class SearchForm extends Component {
  static propTypes = {
    searchType: PropTypes.oneOf(['vendors', 'packages', 'titles']).isRequired,
    searchTypeLocations: PropTypes.shape({
      vendors: PropTypes.object.isRequired,
      packages: PropTypes.object.isRequired,
      titles: PropTypes.object.isRequired
    }).isRequired,
    onSearch: PropTypes.func.isRequired,
    searchString: PropTypes.string
  };

  state = {
    searchString: this.props.searchString || ''
  };

  componentWillReceiveProps({ searchString = '' }) {
    if (searchString !== this.state.searchString) {
      this.setState({ searchString });
    }
  }

  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.props.onSearch(this.state.searchString);
  };

  handleChangeSearch = (e) => {
    this.setState({ searchString: e.target.value });
  };

  render() {
    const { searchType, searchTypeLocations } = this.props;
    const { searchString } = this.state;

    return (
      <div className={styles['search-form-container']} data-test-search-form={searchType}>
        <div className={styles['search-switcher']}>
          {Object.keys(searchTypeLocations).map(type => (
            <NavLink
              key={type}
              title={`search ${type}`}
              to={searchTypeLocations[type]}
              activeClassName={styles['is-active']}
              data-test-search-type-button={type}
            >
              {capitalize(type)}
            </NavLink>
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
        </form>
      </div>
    );
  }
}

import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import { Link } from 'react-router-dom';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';

export default class App extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      search: '',
      searchQuery: '',
      searchResults: null,
      errors: null
    };
  }

  render () {
    let {
      search,
      searchQuery,
      searchResults,
      errors
    } = this.state;

    let hasSearchResults = (searchResults && searchResults.totalResults > 0);

    return (
      <div data-test-eholdings>
        <Paneset>
          <Pane
            defaultWidth="100%"
            header={
              <form onSubmit={this.searchSubmit}>
                <input
                  type="search"
                  name="search"
                  value={search}
                  placeholder="Search for vendors"
                  data-test-search-field
                  onChange={this.handleChange} />
                <button data-test-search-submit type="submit" disabled={!search}>Search</button>
              </form>
            }>

            {!!errors && Array(errors).map((err, i) => (
              <p key={i} data-test-search-error-message>
                {err.message}. {err.code}
              </p>
            ))}
            {(!hasSearchResults && searchQuery) ? (
              <p data-test-search-no-results>
                No results found for <strong>{`"${searchQuery}"`}</strong>.
              </p>
            ) : (
              <ul data-test-search-results-list>
                {hasSearchResults && searchResults.vendorList.map((vendor) => (
                  <li data-test-search-results-item key={vendor.vendorId}>
                    <Link to={`/eholdings/vendors/${vendor.vendorId}`}>{vendor.vendorName}</Link>
                  </li>
                ))}
              </ul>
            )}
          </Pane>
        </Paneset>
      </div>
    );
  }

  get searchSubmit() {
    return (e) => {
      let { search } = this.state;

      e.preventDefault();
      fetch(`/eholdings/vendors?search=${search}`).then((res) => {
        if (!res.ok) {
          res.json().then((data) => {
            this.setState({
              errors: data,
              searchQuery: search
            });
          });
        } else {
          res.json().then((data) => {
            this.setState({
              searchResults: data,
              searchQuery: search
            });
          });
        }
      });
    }
  }

  get handleChange() {
    return (e) => {
      this.setState({
        search: e.target.value
      });
    };
  }
}

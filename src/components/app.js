import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

export default class App extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      search: ''
    };
  }

  render () {
    let {
      search,
      searchResults
    } = this.state;

    return (
      <div>
        <h1>Folio Resource Management</h1>
        <form onSubmit={this.searchSubmit}>
          <input
            type="search"
            name="search"
            value={search}
            placeholder="Search"
            data-test-search-field
            onChange={this.handleChange} />
          <button data-test-search-submit type="submit" disabled={!search}>Search</button>
        </form>
        <ul data-test-search-results-list>
          {!!searchResults && searchResults.vendors.map((vendor) => (
            <li data-test-search-results-item key={vendor.vendorId}>
              {vendor.vendorName}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  get searchSubmit() {
    return (e) => {
      let { search } = this.state;

      e.preventDefault();
      fetch(`/eholdings/vendors?search=${search}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          searchResults: data
        });
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

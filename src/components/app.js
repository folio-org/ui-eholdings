import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';

export default class App extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    resources: PropTypes.shape({
      searchVendors: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object)
      })
    }).isRequired
  };

  static manifest = Object.freeze({
    searchVendors: {
      type: 'okapi',
      path: 'eholdings/vendors?search=?{search}',
      records: 'vendorList',
      pk: 'vendorId'
    }
  });

  constructor(props) {
    super(props);

    const query = queryString.parse(props.location.search);

    this.state = {
      search: query.search || '',
      query
    };
  }

  componentWillReceiveProps({ location }) {
    if (location.search !== this.props.location.search) {
      this.setState({ query: queryString.parse(location.search) });
    }
  }

  handleSearch = (e) => {
    const { search, query } = this.state;
    const { location: { pathname }, history } = this.props;
    const searchQuery = queryString.stringify({ ...query, search });

    e.preventDefault();
    history.push(`${pathname}?${searchQuery}`);
  };

  handleChange = (e) => {
    this.setState({
      search: e.target.value
    });
  };

  getVendors() {
    const { resources: { searchVendors } } = this.props;
    if (!searchVendors) { return []; }
    return searchVendors.records;
  }

  get isLoading() {
    const { resources: { searchVendors } } = this.props;
    return !searchVendors || searchVendors.isPending;
  }

  render () {
    const { search, query } = this.state;

    const vendors = this.getVendors();
    const hasSearchResults = vendors && vendors.length > 0;

    return (
      <div data-test-eholdings>
        <Paneset>
          <Pane
              defaultWidth="100%"
              header={(
                <form onSubmit={this.handleSearch}>
                  <input
                      type="search"
                      name="search"
                      value={search}
                      placeholder="Search for vendors"
                      data-test-search-field
                      onChange={this.handleChange} />
                  <button
                      type="submit"
                      disabled={!search}
                      data-test-search-submit>
                    Search
                  </button>
                </form>
              )}>
            {this.isLoading ? (
              <p>...loading</p>
            ) : (!hasSearchResults && query.search) ? (
              <p data-test-search-no-results>
                No results found for <strong>{`"${query.search}"`}</strong>.
              </p>
            ) : (
              <ul data-test-search-results-list>
                {hasSearchResults && vendors.map((vendor) => (
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
}

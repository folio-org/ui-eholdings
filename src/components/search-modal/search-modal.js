import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import SearchForm from '../search-form';
import SearchBadge from './search-badge';

export const normalize = (query = {}) => {
  return {
    filter: query.filter || {},
    q: query.q || '',
    searchfield: query.searchfield,
    sort: query.sort
  };
};

export const filterCountFromQuery = ({ q, sort, filter }) => {
  return [q, sort]
    .concat(Object.values(filter || []))
    .filter(Boolean).length;
};

class SearchModal extends React.PureComponent {
  static propTypes = {
    listType: PropTypes.string,
    onFilter: PropTypes.func,
    onSearch: PropTypes.func,
    query: PropTypes.object,
  };

  state = {
    isModalVisible: false,
    query: normalize(this.props.query)
  };

  updateFilter(query) {
    if (this.props.onFilter) {
      this.props.onFilter({
        ...query,
        q: query.q === '' ? undefined : query.q
      });
    }
  }

  toggle = () => {
    this.setState(({ isModalVisible }) => ({
      isModalVisible: !isModalVisible
    }));
  }

  close = () => {
    this.setState({
      isModalVisible: false,
    });
  }

  updateSearch = () => {
    this.setState({
      isModalVisible: false,
    });

    this.updateFilter(this.state.query);
  }

  resetSearch = () => {
    this.setState({
      isModalVisible: false,
    });

    this.updateFilter({});
  }

  handleListSearch = (params) => {
    let { query } = this.props;

    if (this.props.onSearch) {
      this.props.onSearch(params);
    }

    this.setState({
      isModalVisible: query.q === params.q
    });
  }

  handleSearchFieldChange = (searchfield) => {
    this.setState(({ query }) => ({
      query: normalize({
        ...query,
        searchfield
      })
    }));
  }

  handleSearchQueryChange = q => {
    this.setState(({ query }) => ({
      query: {
        ...query,
        q
      },
    }));
  }

  handleFilterChange = (sort, filter) => {
    this.setState(({ query }) => ({
      query: normalize({
        sort,
        filter,
        q: query.q
      }),
    }));
  }

  render() {
    let { listType } = this.props;

    let {
      isModalVisible,
      query
    } = this.state;

    let queryFromProps = normalize(this.props.query);

    let filterCount = filterCountFromQuery(queryFromProps);

    let hasChanges = !isEqual(queryFromProps, query);

    return (
      <Fragment>
        <SearchBadge data-test-eholdings-search-modal-badge filterCount={filterCount} onClick={this.toggle} />
        {isModalVisible && (
          <Modal
            open
            size="small"
            label={<FormattedMessage id="ui-eholdings.filter.filterType" values={{ listType }} />}
            onClose={this.close}
            id="eholdings-details-view-search-modal"
            closeOnBackgroundClick
            dismissible
            footer={
              <ModalFooter>
                <Button
                  data-test-eholdings-modal-search-button
                  buttonStyle="primary"
                  disabled={!hasChanges}
                  onClick={this.updateSearch}
                >
                  <FormattedMessage id="ui-eholdings.label.search" />
                </Button>
                <Button
                  data-test-eholdings-modal-reset-all-button
                  disabled={isEqual(normalize({}), this.state.query)}
                  onClick={this.resetSearch}
                >
                  <FormattedMessage id="ui-eholdings.filter.resetAll" />
                </Button>
              </ModalFooter>
            }
          >
            <SearchForm
              searchType={listType}
              searchString={query.q}
              searchFilter={query.filter}
              searchField={query.searchfield}
              sort={query.sort}
              onSearch={this.updateSearch}
              displaySearchTypeSwitcher={false}
              displaySearchButton={false}
              onFilterChange={this.handleFilterChange}
              onSearchChange={this.handleSearchQueryChange}
              onSearchFieldChange={this.handleSearchFieldChange}
            />
          </Modal>
        )}
      </Fragment>
    );
  }
}

export default SearchModal;

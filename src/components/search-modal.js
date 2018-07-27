import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import {
  Badge,
  IconButton,
  Modal,
  ModalFooter,
} from '@folio/stripes-components';

import SearchForm from './search-form';
import styles from './details-view/details-view.css';

const normalize = (query = {}) => {
  return {
    filter: query.filter || {},
    q: query.q || '',
    searchfield: query.searchfield,
    sort: query.sort
  };
};

export default class SearchModal extends React.PureComponent {
  static propTypes = {
    query: PropTypes.object,
    listType: PropTypes.string,
    onSearch: PropTypes.func,
    onFilter: PropTypes.func,
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

  handleSearchQueryChange = q => {
    this.setState({
      query: {
        ...this.state.query,
        q
      },
    });
  }

  handleFilterChange = (sort, filter) => {
    this.setState({
      query: normalize({
        sort,
        filter,
        q: this.state.query.q
      }),
    });
  }

  render() {
    let { listType } = this.props;

    let {
      isModalVisible,
      query
    } = this.state;

    let queryFromProps = normalize(this.props.query);

    let filterCount = [queryFromProps.q, queryFromProps.sort]
      .concat(Object.values(queryFromProps.filter))
      .filter(Boolean).length;

    let hasChanges = !isEqual(queryFromProps, query);

    return (
      <Fragment>
        <div className={styles['search-filter-area']}>
          {filterCount > 0 && (
            <div data-test-eholdings-details-view-filters>
              <Badge className={styles['filter-count']}>{filterCount}</Badge>
            </div>
          )}
          <div data-test-eholdings-details-view-search>
            <IconButton icon="search" onClick={this.toggle} />
          </div>
        </div>

        {isModalVisible && (
          <Modal
            open
            size="small"
            label={`Filter ${listType}`}
            onClose={this.close}
            id="eholdings-details-view-search-modal"
            closeOnBackgroundClick
            dismissible
            footer={
              <ModalFooter
                primaryButton={{
                  'label': 'Search',
                  'onClick': this.updateSearch,
                  'disabled': !hasChanges,
                  'data-test-eholdings-modal-search-button': true
                }}
                secondaryButton={{
                  'label': 'Reset all',
                  'onClick': this.resetSearch,
                  'disabled': isEqual(normalize({}), this.state.query),
                  'data-test-eholdings-modal-reset-all-button': true
                }}
              />
            }
          >
            <SearchForm
              searchType={listType}
              searchString={query.q}
              searchFilter={query.filter}
              searchField={query.searchField}
              sort={query.sort}
              onSearch={this.handleListSearch}
              displaySearchTypeSwitcher={false}
              displaySearchButton={false}
              onFilterChange={this.handleFilterChange}
              onSearchChange={this.handleSearchQueryChange}
            />
          </Modal>
        )}
      </Fragment>
    );
  }
}

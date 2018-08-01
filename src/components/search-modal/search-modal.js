import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { injectIntl, intlShape } from 'react-intl';

import {
  Badge,
  IconButton,
  Modal,
  ModalFooter,
} from '@folio/stripes-components';

import SearchForm from '../search-form';
import styles from './search-modal.css';

const normalize = (query = {}) => {
  return {
    filter: query.filter || {},
    q: query.q || '',
    searchfield: query.searchfield,
    sort: query.sort
  };
};

class SearchModal extends React.PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    listType: PropTypes.string,
    onSearch: PropTypes.func,
    onFilter: PropTypes.func,
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
    let { intl, listType } = this.props;

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
        <div className={styles['search-filter-area']} data-test-eholdings-details-view-filters>
          {filterCount > 0 && (
            <span data-test-eholdings-details-view-filters-badge>
              <Badge className={styles['filter-count']}>{filterCount}</Badge>
            </span>
          )}
          <IconButton
            icon="search"
            onClick={this.toggle}
            data-test-eholdings-details-view-search
          />
        </div>

        {isModalVisible && (
          <Modal
            open
            size="small"
            label={intl.formatMessage({ id: 'ui-eholdings.filter.filterType' }, { listType })}
            onClose={this.close}
            id="eholdings-details-view-search-modal"
            closeOnBackgroundClick
            dismissible
            footer={
              <ModalFooter
                primaryButton={{
                  'label': intl.formatMessage({ id: 'ui-eholdings.label.search' }),
                  'onClick': this.updateSearch,
                  'disabled': !hasChanges,
                  'data-test-eholdings-modal-search-button': true
                }}
                secondaryButton={{
                  'label': intl.formatMessage({ id: 'ui-eholdings.filter.resetAll' }),
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

export default injectIntl(SearchModal);

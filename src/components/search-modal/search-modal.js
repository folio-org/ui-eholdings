import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { injectIntl, intlShape } from 'react-intl';

import {
  Modal,
  ModalFooter,
} from '@folio/stripes-components';

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
    let { intl, listType } = this.props;

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

        <Modal
          open={isModalVisible}
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
      </Fragment>
    );
  }
}

export default injectIntl(SearchModal);

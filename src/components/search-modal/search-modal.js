import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  isEqual,
  hasIn,
} from 'lodash';
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
    tagsModel: PropTypes.object.isRequired,
  };

  state = {
    isModalVisible: false,
    query: normalize(this.props.query),
    searchByTagsEnabled: hasIn(this.props.query, 'filter.tags'),
  };

  updateFilter(query) {
    let searchQuery;

    if (!this.state.searchByTagsEnabled && query.q !== '') {
      searchQuery = query.q;
    }

    const filter = { ...query.filter };

    if (!this.state.searchByTagsEnabled) {
      delete filter.tags;
    }

    if (this.props.onFilter) {
      this.props.onFilter({
        ...query,
        filter,
        q: searchQuery
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
    this.close();
    this.updateFilter(this.state.query);
  }

  resetSearch = () => {
    this.close();
    this.updateFilter({});
  }

  handleListSearch = (params) => {
    const { query } = this.props;

    if (this.props.onSearch) {
      this.props.onSearch(params);
    }

    this.setState({
      isModalVisible: query.q === params.q
    });
  }

  toggleSearchByTags = () => {
    this.setState(currentState => ({
      searchByTagsEnabled: !currentState.searchByTagsEnabled
    }));
  };

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
        searchfield: query.searchfield,
        q: query.q
      }),
    }));
  }

  handleTagFilterChange = (filter) => {
    this.setState(({ query }) => ({
      query: normalize({
        sort: query.sort,
        filter,
      }),
    }), () => {
      this.updateFilter(this.state.query);
      this.close();
    });
  }

  render() {
    const { listType, tagsModel } = this.props;

    const {
      isModalVisible,
      query,
      searchByTagsEnabled,
    } = this.state;

    const queryFromProps = normalize(this.props.query);

    const filterCount = filterCountFromQuery(queryFromProps);

    const hasChanges = !isEqual(queryFromProps, query);

    return (
      <Fragment>
        <SearchBadge
          data-test-eholdings-search-modal-badge
          filterCount={filterCount}
          onClick={this.toggle}
        />
        {isModalVisible && (
          <Modal
            open
            size="small"
            label={<FormattedMessage id={`ui-eholdings.filter.filterType.${listType}`} />}
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
              tagsModel={tagsModel}
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
              onTagFilterChange={this.handleTagFilterChange}
              searchByTagsEnabled={searchByTagsEnabled}
              onSearchByTagsToggle={this.toggleSearchByTags}
            />
          </Modal>
        )}
      </Fragment>
    );
  }
}

export default SearchModal;

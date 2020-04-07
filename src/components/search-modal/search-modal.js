import React from 'react';
import PropTypes from 'prop-types';
import {
  isEqual,
} from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import SearchForm from '../search-form';
import SearchBadge from './search-badge';
import { accessTypesReduxStateShape } from '../../constants';

export const normalize = (query = {}) => {
  return {
    filter: query.filter || {
      tags: undefined,
      type: undefined,
      selected: undefined,
      'access-type': undefined,
    },
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
    accessTypes: accessTypesReduxStateShape,
    listType: PropTypes.string,
    onFilter: PropTypes.func,
    onSearch: PropTypes.func,
    query: PropTypes.object,
    tagsModel: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const queryContainsTagsFilter = !!props.query?.filter?.tags;
    const queryContainsAccessTypesFilter = !!props.query?.filter['access-type'];

    this.state = {
      isModalVisible: false,
      query: normalize(this.props.query),
      searchByTagsEnabled: queryContainsTagsFilter,
      searchByAccessTypesEnabled: queryContainsAccessTypesFilter && !queryContainsTagsFilter,
    };
  }

  updateFilter(query) {
    const {
      searchByTagsEnabled,
      searchByAccessTypesEnabled,
    } = this.state;

    let searchQuery;

    if (!searchByTagsEnabled && query.q !== '') {
      searchQuery = query.q;
    }

    const filter = { ...query.filter };

    if (!searchByTagsEnabled) {
      filter.tags = undefined;
    }

    if (!searchByAccessTypesEnabled) {
      filter['access-type'] = undefined;
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

  toggleFilter = filterName => () => {
    const filterToBeToggled = filterName === 'access-type'
      ? 'searchByAccessTypesEnabled'
      : 'searchByTagsEnabled';

    const filterToBeDisabled = filterName === 'access-type'
      ? 'searchByTagsEnabled'
      : 'searchByAccessTypesEnabled';

    this.setState(currentState => ({
      [filterToBeToggled]: !currentState[filterToBeToggled],
      [filterToBeDisabled]: false,
    }));
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
        searchfield: query.searchfield,
        q: query.q
      }),
    }));
  }

  handleStandaloneFilterChange = filter => {
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
    const {
      listType,
      tagsModel,
      accessTypes,
    } = this.props;

    const {
      isModalVisible,
      query,
      searchByTagsEnabled,
      searchByAccessTypesEnabled,
    } = this.state;

    const queryFromProps = normalize(this.props.query);

    const filterCount = filterCountFromQuery(queryFromProps);

    const hasChanges = !isEqual(queryFromProps, query);

    return (
      <>
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
              onTagFilterChange={this.handleStandaloneFilterChange}
              searchByTagsEnabled={searchByTagsEnabled}
              searchByAccessTypesEnabled={searchByAccessTypesEnabled}
              onStandaloneFilterToggle={this.toggleFilter}
              onStandaloneFilterChange={this.handleStandaloneFilterChange}
              accessTypesStoreData={accessTypes}
            />
          </Modal>
        )}
      </>
    );
  }
}

export default SearchModal;

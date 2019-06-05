import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Button,
  ButtonGroup,
  Icon,
  SearchField,
  Select
} from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';
import ProviderSearchFilters from '../provider-search-filters';
import PackageSearchFilters from '../package-search-filters';
import TitleSearchFilters from '../title-search-filters';

import styles from './search-form.css';
import { searchTypes } from '../../constants';

const validSearchTypes = [
  searchTypes.PROVIDERS,
  searchTypes.PACKAGES,
  searchTypes.TITLES
];
class SearchForm extends Component {
  static propTypes = {
    displaySearchButton: PropTypes.bool,
    displaySearchTypeSwitcher: PropTypes.bool,
    isLoading: PropTypes.bool,
    onFilterChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onSearchFieldChange: PropTypes.func,
    searchField: PropTypes.string,
    searchFilter: PropTypes.shape({
      filter: PropTypes.object,
      q: PropTypes.string,
      searchfield: PropTypes.string,
    }),
    searchString: PropTypes.string,
    searchType: PropTypes.oneOf(validSearchTypes).isRequired,
    searchTypeUrls: PropTypes.shape({
      packages: PropTypes.string.isRequired,
      providers: PropTypes.string.isRequired,
      titles: PropTypes.string.isRequired
    }),
    sort: PropTypes.string,
    tagsModel: PropTypes.object.isRequired
  };

  static defaultProps = {
    displaySearchTypeSwitcher: true,
    displaySearchButton: true,
    searchString: '',
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.props.onSearch();
  };

  handleChangeSearch = (e) => {
    this.props.onSearchChange(e.target.value);
  };

  handleClearSearch = () => {
    this.props.onSearchChange('');
  };

  handleUpdateFilter = (filter) => {
    const { sort, ...searchFilter } = filter;

    this.props.onFilterChange(sort, searchFilter);
  };

  handleChangeIndex = (e) => {
    this.props.onSearchFieldChange(e.target.value);
  };

  /**
   * Returns the component that is responsible for rendering filters
   * for the current searchType
   */
  getFiltersComponent = (searchType) => {
    if (searchType === searchTypes.TITLES) {
      return TitleSearchFilters;
    } else if (searchType === searchTypes.PACKAGES) {
      return PackageSearchFilters;
    } else if (searchType === searchTypes.PROVIDERS) {
      return ProviderSearchFilters;
    }

    return null;
  };

  renderTagFilter() {
    const {
      tagsModel,
    } = this.props;

    return tagsModel.isLoading
      ? <Icon icon="spinner-ellipsis" />
      : (
        <Accordion>
          <MultiSelectionFilter
            id="tags-filter"
            dataOptions={
              tagsModel.map(tag => ({
                value: tag.label.toLowerCase(),
                label: tag.label.toLowerCase()
              }))
              }
            name="tags"
          />
        </Accordion>
      );
  }

  render() {
    const {
      searchType,
      searchTypeUrls,
      displaySearchTypeSwitcher,
      isLoading,
      displaySearchButton,
      searchField,
      searchFilter,
      searchString,
      sort
    } = this.props;
    const Filters = this.getFiltersComponent(searchType);
    // sort is treated separately from the rest of the filters on submit,
    // but treated together when rendering the filters.
    const combinedFilters = { sort, ...searchFilter };

    return (
      <div className={styles['search-form-container']} data-test-search-form={searchType}>
        {displaySearchTypeSwitcher && (
          <ButtonGroup
            data-test-search-form-type-switcher
            fullWidth
            role='tablist'
          >
            {validSearchTypes.map(type => (
              <Button
                role='tab'
                aria-selected={searchType === type}
                aria-controls={type + '-panel'}
                id={type + '-tab'}
                key={type}
                to={searchTypeUrls[type]}
                buttonStyle={searchType === type ? 'primary' : 'default'}
                data-test-search-type-button={type}
              >
                <FormattedMessage id={`ui-eholdings.search.searchType.${type}`} />
              </Button>
            ))}
          </ButtonGroup>
        )}
        <form
          onSubmit={this.handleSearchSubmit}
          role='tabpanel'
          aria-labelledby={searchType + '-tab'}
          id={searchType + '-panel'}
        >
          <div data-test-search-field>
            <FormattedMessage id={`ui-eholdings.search.searchType.${searchType}`}>
              {placeholder => (
                <Fragment>
                  {(searchType === searchTypes.TITLES) && (
                    <Select
                      onChange={this.handleChangeIndex}
                      value={searchField}
                    >
                      <FormattedMessage id="ui-eholdings.label.title">
                        {(label) => <option value="title">{label}</option>}
                      </FormattedMessage>
                      <FormattedMessage id="ui-eholdings.label.isxn">
                        {(label) => <option value="isxn">{label}</option>}
                      </FormattedMessage>
                      <FormattedMessage id="ui-eholdings.label.publisher">
                        {(label) => <option value="publisher">{label}</option>}
                      </FormattedMessage>
                      <FormattedMessage id="ui-eholdings.label.subject">
                        {(label) => <option value="subject">{label}</option>}
                      </FormattedMessage>
                    </Select>
                  )}
                  <SearchField
                    name="search"
                    onChange={this.handleChangeSearch}
                    onClear={this.handleClearSearch}
                    value={searchString}
                    placeholder={placeholder}
                    loading={isLoading}
                  />
                </Fragment>
              )}
            </FormattedMessage>
          </div>

          { displaySearchButton && (
            <Button
              type="submit"
              buttonStyle="primary"
              fullWidth
              disabled={!searchString}
              data-test-search-submit
            >
              <FormattedMessage id="ui-eholdings.label.search" />
            </Button>
          )}
          {Filters && (
            <div>
              <Filters
                activeFilters={combinedFilters}
                onUpdate={this.handleUpdateFilter}
              />
              {this.renderTagFilter()}
            </div>
          )}
        </form>
      </div>
    );
  }
}
export default SearchForm;

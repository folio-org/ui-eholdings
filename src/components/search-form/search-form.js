import {
  sortBy
} from 'lodash';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import update from 'lodash/fp/update';

import {
  Accordion,
  Button,
  ButtonGroup,
  FilterAccordionHeader,
  Icon,
  SearchField,
  Select,
  Checkbox,
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
    onSearchByTagsToggle: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onSearchFieldChange: PropTypes.func,
    onTagFilterChange: PropTypes.func.isRequired,
    searchByTagsEnabled: PropTypes.bool.isRequired,
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

  state = {
    sections: {
      accordionTagFilter: false,
    },
  };

  toggleSection = ({ id }) => {
    const newState = update(`sections.${id}`, value => !value, this.state);
    this.setState(newState);
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

  handleUpdateTagFilter = (filter) => {
    const tagFilter = {
      tags: filter.values.length > 0 ? filter.values.join(',') : undefined
    };
    this.props.onTagFilterChange(tagFilter);
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

  getSortedDataOptions = () => {
    const { tagsModel = [] } = this.props;
    const dataOptions = tagsModel.map(tag => {
      const tagDisplay = tag.label.toLowerCase();
      return {
        value: tagDisplay,
        label: tagDisplay,
      };
    });

    return sortBy(dataOptions, ['value']);
  }

  renderSearchByTagsCheckbox() {
    return (
      <Checkbox
        checked={this.props.searchByTagsEnabled}
        label={(
          <span
            className={styles['tags-search-warning']}
            data-test-eholdings-tag-message
          >
            <FormattedMessage id="ui-eholdings.search.searchByTagsOnly" />
          </span>
        )}
        onClick={this.props.onSearchByTagsToggle}
        data-test-tags-checkbox
      />
    );
  }

  renderTagFilter() {
    const {
      tagsModel,
      searchByTagsEnabled,
      searchFilter = {},
    } = this.props;

    const {
      tags = ''
    } = searchFilter;

    const {
      sections,
    } = this.state;

    const tagsList = tags ? tags.split(',').map(tag => {
      return tag.toLowerCase();
    }) : [];

    tagsList.sort();

    return tagsModel.isLoading
      ? <Icon icon="spinner-ellipsis" />
      : (
        <div
          className={styles['search-filters']}
          data-test-eholdings-tag-filter
        >
          <Accordion
            label={<FormattedMessage id="ui-eholdings.tags" />}
            id="accordionTagFilter"
            separator={false}
            open={sections.accordionTagFilter}
            closedByDefault
            header={FilterAccordionHeader}
            displayClearButton={tagsList.length > 0}
            onClearFilter={() => this.props.onTagFilterChange({ tags: undefined })}
            onToggle={this.toggleSection}
          >
            {this.renderSearchByTagsCheckbox()}
            <MultiSelectionFilter
              id="selectTagFilter"
              dataOptions={this.getSortedDataOptions()}
              name="tags"
              onChange={this.handleUpdateTagFilter}
              selectedValues={tagsList}
              disabled={!searchByTagsEnabled}
            />
          </Accordion>
        </div>
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
      sort,
      searchByTagsEnabled
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
                    disabled={searchByTagsEnabled}
                  />
                </Fragment>
              )}
            </FormattedMessage>
          </div>

          {displaySearchButton && (
            <Button
              type="submit"
              buttonStyle="primary"
              fullWidth
              disabled={!searchString || searchByTagsEnabled}
              data-test-search-submit
            >
              <FormattedMessage id="ui-eholdings.label.search" />
            </Button>
          )}
          {Filters && (
            <div>
              {this.renderTagFilter()}
              <Filters
                activeFilters={combinedFilters}
                onUpdate={this.handleUpdateFilter}
                disabled={searchByTagsEnabled}
              />
            </div>
          )}
        </form>
      </div>
    );
  }
}
export default SearchForm;

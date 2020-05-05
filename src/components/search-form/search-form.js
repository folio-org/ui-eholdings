import {
  sortBy
} from 'lodash';
import React, { Component } from 'react';
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
import {
  searchTypes,
  accessTypesReduxStateShape,
} from '../../constants';
import { getTagLabelsArr } from '../utilities';

const validSearchTypes = [
  searchTypes.PROVIDERS,
  searchTypes.PACKAGES,
  searchTypes.TITLES
];
class SearchForm extends Component {
  static propTypes = {
    accessTypesStoreData: accessTypesReduxStateShape.isRequired,
    displaySearchButton: PropTypes.bool,
    displaySearchTypeSwitcher: PropTypes.bool,
    isLoading: PropTypes.bool,
    onFilterChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onSearchFieldChange: PropTypes.func,
    onStandaloneFilterChange: PropTypes.func.isRequired,
    onStandaloneFilterToggle: PropTypes.func.isRequired,
    searchByAccessTypesEnabled: PropTypes.bool.isRequired,
    searchByTagsEnabled: PropTypes.bool.isRequired,
    searchField: PropTypes.string,
    searchFilter: PropTypes.shape({
      'access-type': PropTypes.string,
      filter: PropTypes.object,
      q: PropTypes.string,
      searchfield: PropTypes.string,
      tags: PropTypes.string,
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
    searchFilter: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        accordionTagFilter: false,
        accessTypesFilter: false,
      },
    };
    this.searchField = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchType !== this.props.searchType) {
      this.searchField.current.focus();
    }
  }

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

  handleStandaloneFilterChange = filter => {
    const formattedFilter = {
      [filter.name]: filter.values.join(',') || undefined,
    };
    this.props.onStandaloneFilterChange(formattedFilter);
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
    const dataOptions = getTagLabelsArr(tagsModel).map(tag => {
      const tagDisplay = tag.label.toLowerCase();
      return {
        value: tagDisplay,
        label: tagDisplay,
      };
    });

    return sortBy(dataOptions, ['value']);
  }

  renderSearchByTagsCheckbox() {
    const {
      searchByTagsEnabled,
      onStandaloneFilterToggle,
    } = this.props;

    return (
      <Checkbox
        checked={searchByTagsEnabled}
        label={(
          <span
            className={styles['tags-search-warning']}
            data-test-eholdings-tag-message
          >
            <FormattedMessage id="ui-eholdings.search.searchByTagsOnly" />
          </span>
        )}
        onClick={onStandaloneFilterToggle('tags')}
        data-test-tags-checkbox
      />
    );
  }

  renderSearchByAccessTypesCheckbox() {
    const {
      onStandaloneFilterToggle,
      searchByAccessTypesEnabled,
    } = this.props;

    return (
      <Checkbox
        checked={searchByAccessTypesEnabled}
        label={(
          <span
            className={styles['tags-search-warning']}
            data-test-eholdings-access-types-message
          >
            <FormattedMessage id="ui-eholdings.search.searchByAccessTypesOnly" />
          </span>
        )}
        onClick={onStandaloneFilterToggle('access-type')}
        data-test-toggle-access-types-filter-checkbox
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
            onClearFilter={() => this.props.onStandaloneFilterChange({ tags: undefined })}
            onToggle={this.toggleSection}
          >
            {this.renderSearchByTagsCheckbox()}
            <FormattedMessage id="ui-eholdings.tags.filter">
              {
                label => (
                  <MultiSelectionFilter
                    id="selectTagFilter"
                    ariaLabel={label}
                    dataOptions={this.getSortedDataOptions()}
                    name="tags"
                    onChange={this.handleStandaloneFilterChange}
                    selectedValues={tagsList}
                    disabled={!searchByTagsEnabled}
                  />
                )
              }
            </FormattedMessage>
          </Accordion>
        </div>
      );
  }

  renderAccessTypesFilter() {
    const {
      accessTypesStoreData,
      searchByAccessTypesEnabled,
      searchFilter,
    } = this.props;

    const {
      'access-type': accessTypes = ''
    } = searchFilter;

    const {
      sections,
    } = this.state;

    const accessTypesList = accessTypes
      ? accessTypes.split(',')
      : [];

    accessTypesList.sort();

    const accessStatusTypesExist = !!accessTypesStoreData?.items?.data?.length;

    return accessTypesStoreData?.isLoading
      ? <Icon icon="spinner-ellipsis" />
      : accessStatusTypesExist && (
        <div
          className={styles['search-filters']}
          data-test-eholdings-access-types-filter
        >
          <Accordion
            label={<FormattedMessage id="ui-eholdings.settings.accessStatusTypes" />}
            id="accessTypesFilter"
            separator={false}
            open={sections.accessTypesFilter}
            closedByDefault
            header={FilterAccordionHeader}
            displayClearButton={accessTypesList.length}
            onClearFilter={() => this.props.onStandaloneFilterChange({ 'access-type': undefined })}
            onToggle={this.toggleSection}
          >
            {this.renderSearchByAccessTypesCheckbox()}
            <FormattedMessage id="ui-eholdings.accessTypes.filter">
              {
                label => (
                  <MultiSelectionFilter
                    id="accessTypeFilterSelect"
                    ariaLabel={label}
                    dataOptions={this.getAccessTypesDataOptions()}
                    name="access-type"
                    onChange={this.handleStandaloneFilterChange}
                    selectedValues={accessTypesList}
                    disabled={!searchByAccessTypesEnabled}
                  />
                )
              }
            </FormattedMessage>
          </Accordion>
        </div>
      );
  }

  getAccessTypesDataOptions() {
    const { accessTypesStoreData } = this.props;

    return accessTypesStoreData.items.data.map(({ attributes }) => ({
      value: attributes.name,
      label: attributes.name,
    }));
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
      searchByTagsEnabled,
      searchByAccessTypesEnabled,
    } = this.props;
    const Filters = this.getFiltersComponent(searchType);
    // sort is treated separately from the rest of the filters on submit,
    // but treated together when rendering the filters.
    const combinedFilters = { sort, ...searchFilter };
    const standaloneFiltersEnabled = searchByTagsEnabled || searchByAccessTypesEnabled;

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
          aria-labelledby={searchType + '-tab'}
          id={searchType + '-panel'}
        >
          <div data-test-search-field>
            <FormattedMessage id={`ui-eholdings.search.searchType.${searchType}`}>
              {placeholder => (
                <>
                  {(searchType === searchTypes.TITLES) && (
                    <FormattedMessage id="ui-eholdings.search.selectFieldToSearch">
                      {(ariaLabel) => (
                        <Select
                          onChange={this.handleChangeIndex}
                          value={searchField}
                          aria-label={ariaLabel}
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
                    </FormattedMessage>
                  )}
                  <FormattedMessage id="ui-eholdings.search.enterYourSearch">
                    {(ariaLabel) => (
                      <SearchField
                        name="search"
                        inputRef={this.searchField}
                        autoFocus
                        onChange={this.handleChangeSearch}
                        onClear={this.handleClearSearch}
                        value={searchString}
                        placeholder={placeholder}
                        loading={isLoading}
                        disabled={standaloneFiltersEnabled}
                        ariaLabel={ariaLabel}
                      />
                    )}
                  </FormattedMessage>
                </>
              )}
            </FormattedMessage>
          </div>

          {displaySearchButton && (
            <Button
              type="submit"
              buttonStyle="primary"
              fullWidth
              disabled={!searchString || standaloneFiltersEnabled}
              data-test-search-submit
            >
              <FormattedMessage id="ui-eholdings.label.search" />
            </Button>
          )}
          {Filters && (
            <div role="tablist">
              {this.renderTagFilter()}
              {(searchType === searchTypes.PACKAGES || searchType === searchTypes.TITLES) && this.renderAccessTypesFilter()}
              <Filters
                activeFilters={combinedFilters}
                onUpdate={this.handleUpdateFilter}
                disabled={standaloneFiltersEnabled}
              />
            </div>
          )}
        </form>
      </div>
    );
  }
}
export default SearchForm;

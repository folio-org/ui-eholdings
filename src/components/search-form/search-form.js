import {
  createRef,
  Component,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import update from 'lodash/fp/update';
import sortBy from 'lodash/sortBy';

import {
  IfPermission,
} from '@folio/stripes/core';

import {
  Button,
  ButtonGroup,
  FilterAccordionHeader,
  SearchField,
  Select,
} from '@folio/stripes/components';

import ProviderSearchFilters from '../provider-search-filters';
import PackageSearchFilters from '../package-search-filters';
import TitleSearchFilters from '../title-search-filters';
import {
  searchTypes,
  accessTypesReduxStateShape,
  searchableIndexes,
} from '../../constants';
import { getTagLabelsArr } from '../utilities';
import TagFilterAccordion from './components/tags-filter-accordion';
import AccessTypesFilterAccordion from './components/access-types-filter-accordion';

import styles from './search-form.css';

const validSearchTypes = [
  searchTypes.PROVIDERS,
  searchTypes.PACKAGES,
  searchTypes.TITLES,
];

const searchFiltersComponents = {
  [searchTypes.PACKAGES]: PackageSearchFilters,
  [searchTypes.PROVIDERS]: ProviderSearchFilters,
  [searchTypes.TITLES]: TitleSearchFilters,
};

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
    packagesFacetCollection: PropTypes.object,
    params: PropTypes.object,
    prevDataOfOptedPackage: PropTypes.object,
    results: PropTypes.object,
    searchByAccessTypesEnabled: PropTypes.bool.isRequired,
    searchByTagsEnabled: PropTypes.bool.isRequired,
    searchField: PropTypes.string,
    searchFilter: PropTypes.shape({
      'access-type': PropTypes.arrayOf(PropTypes.string),
      filter: PropTypes.object,
      q: PropTypes.string,
      searchfield: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
    searchString: PropTypes.string,
    searchType: PropTypes.oneOf(validSearchTypes).isRequired,
    searchTypeUrls: PropTypes.shape({
      packages: PropTypes.string.isRequired,
      providers: PropTypes.string.isRequired,
      titles: PropTypes.string.isRequired
    }),
    sort: PropTypes.string,
    tagsModelOfAlreadyAddedTags: PropTypes.object,
    titlesFacets: PropTypes.object,
  };

  static defaultProps = {
    displaySearchTypeSwitcher: true,
    displaySearchButton: true,
    isLoading: false,
    prevDataOfOptedPackage: {},
    params: {},
    results: {},
    searchString: '',
    searchFilter: {},
    packagesFacetCollection: {},
    titlesFacets: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        accordionTagFilter: false,
        accessTypesFilter: false,
      },
    };
    this.searchField = createRef();
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
      [filter.name]: filter.values || undefined,
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
    return searchFiltersComponents[searchType];
  };

  getSortedDataOptions = () => {
    const { tagsModelOfAlreadyAddedTags } = this.props;

    const dataOptions = getTagLabelsArr(tagsModelOfAlreadyAddedTags)
      .filter(tag => tag.value)
      .map(tag => {
        const tagDisplay = tag.value.toLowerCase();

        return {
          value: tagDisplay,
          label: tagDisplay,
        };
      });

    return sortBy(dataOptions, ['value']);
  }

  renderTagFilter() {
    const {
      tagsModelOfAlreadyAddedTags,
      searchByTagsEnabled,
      searchFilter,
      onStandaloneFilterToggle,
      onStandaloneFilterChange,
    } = this.props;
    const {
      sections,
    } = this.state;

    return (
      <TagFilterAccordion
        dataOptions={this.getSortedDataOptions()}
        handleStandaloneFilterChange={this.handleStandaloneFilterChange}
        header={FilterAccordionHeader}
        headerProps={{
          headingLevel: 2,
        }}
        isOpen={sections.accordionTagFilter}
        onStandaloneFilterChange={onStandaloneFilterChange}
        onStandaloneFilterToggle={onStandaloneFilterToggle}
        onToggle={this.toggleSection}
        searchByTagsEnabled={searchByTagsEnabled}
        searchFilter={searchFilter}
        tagsModel={tagsModelOfAlreadyAddedTags}
      />
    );
  }

  renderAccessTypesFilter() {
    const {
      accessTypesStoreData,
      searchByAccessTypesEnabled,
      searchFilter,
      onStandaloneFilterToggle,
      onStandaloneFilterChange,
      searchType,
    } = this.props;
    const {
      sections,
    } = this.state;

    const accessStatusTypesExist = !!accessTypesStoreData?.items?.data?.length;
    const isPackagesOrTitlesSearchType = [searchTypes.PACKAGES, searchTypes.TITLES].includes(searchType);

    if (isPackagesOrTitlesSearchType && accessStatusTypesExist) {
      return (
        <AccessTypesFilterAccordion
          accessTypesStoreData={accessTypesStoreData}
          dataOptions={this.getAccessTypesDataOptions()}
          handleStandaloneFilterChange={this.handleStandaloneFilterChange}
          header={FilterAccordionHeader}
          headerProps={{
            headingLevel: 2,
          }}
          isOpen={sections.accessTypesFilter}
          onStandaloneFilterChange={onStandaloneFilterChange}
          onStandaloneFilterToggle={onStandaloneFilterToggle}
          onToggle={this.toggleSection}
          searchByAccessTypesEnabled={searchByAccessTypesEnabled}
          searchFilter={searchFilter}
        />
      );
    }

    return null;
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
      params,
      searchType,
      searchTypeUrls,
      displaySearchTypeSwitcher,
      isLoading,
      displaySearchButton,
      prevDataOfOptedPackage,
      results,
      searchField,
      searchFilter,
      searchString,
      sort,
      searchByTagsEnabled,
      searchByAccessTypesEnabled,
      packagesFacetCollection,
      titlesFacets,
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
          id="search-form"
        >
          <div data-test-search-field>
            <FormattedMessage id={`ui-eholdings.search.searchType.${searchType}`}>
              {([placeholder]) => (
                <>
                  {(searchType === searchTypes.TITLES) && (
                    <FormattedMessage id="ui-eholdings.search.selectFieldToSearch">
                      {([ariaLabel]) => (
                        <Select
                          onChange={this.handleChangeIndex}
                          value={searchField}
                          aria-label={ariaLabel}
                          data-testid="field-to-search-select"
                        >
                          {Object.values(searchableIndexes).map(value => (
                            <FormattedMessage
                              id={`ui-eholdings.label.${value}`}
                              key={value}
                            >
                              {(label) => <option value={value}>{label}</option>}
                            </FormattedMessage>
                          ))}
                        </Select>
                      )}
                    </FormattedMessage>
                  )}
                  <FormattedMessage id="ui-eholdings.search.enterYourSearch">
                    {([ariaLabel]) => (
                      <SearchField
                        id="eholdings-search"
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
              data-testid="search-submit"
            >
              <FormattedMessage id="ui-eholdings.label.search" />
            </Button>
          )}
          {Filters && (
            <div role="tablist">
              <IfPermission perm="ui-tags.all">
                {this.renderTagFilter()}
              </IfPermission>
              {this.renderAccessTypesFilter()}
              <Filters
                activeFilters={combinedFilters}
                params={params}
                prevDataOfOptedPackage={prevDataOfOptedPackage}
                resultsLength={results.length}
                isResultsLoading={results.isLoading}
                titlesFacets={titlesFacets}
                isPackagesLoading={packagesFacetCollection.isLoading}
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

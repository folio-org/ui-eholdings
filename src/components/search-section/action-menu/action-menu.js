import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

import {
  Badge,
  Button,
  DropdownMenu,
  Icon,
  Tooltip,
  Dropdown,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import { TagsFilter } from '../../tags-filter';
import { AccessTypesFilter } from '../../access-type-filter';
import PackageSearchFilters from '../../package-search-filters';
import ProviderSearchFilters from '../../provider-search-filters';
import TitleSearchFilters from '../../title-search-filters';
import {
  getAccessTypesList,
  getTagLabelsArr,
  getTagsList,
} from '../../utilities';
import {
  searchTypes,
  titleSortFilterConfig,
  selectionStatusFilterConfig,
  publicationTypeTitlesListFilterConfig,
} from '../../../constants';

import styles from './action-menu.css';

const searchFiltersComponents = {
  [searchTypes.PACKAGES]: PackageSearchFilters,
  [searchTypes.PROVIDERS]: ProviderSearchFilters,
  [searchTypes.TITLES]: (props = {}) => (
    <TitleSearchFilters
      availableFilters={[
        titleSortFilterConfig,
        selectionStatusFilterConfig,
        publicationTypeTitlesListFilterConfig,
      ]}
      {...props}
    />
  ),
};

const propTypes = {
  accessTypes: PropTypes.object.isRequired,
  filterCount: PropTypes.number.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onStandaloneFilterChange: PropTypes.func.isRequired,
  onToggleActions: PropTypes.func.isRequired,
  onToggleFilter: PropTypes.func.isRequired,
  packagesFacetCollection: PropTypes.object,
  params: PropTypes.object,
  prevDataOfOptedPackage: PropTypes.object,
  query: PropTypes.object.isRequired,
  results: PropTypes.object,
  searchByAccessTypesEnabled: PropTypes.bool.isRequired,
  searchByTagsEnabled: PropTypes.bool.isRequired,
  searchType: PropTypes.string.isRequired,
  standaloneFiltersEnabled: PropTypes.bool.isRequired,
  tagsModelOfAlreadyAddedTags: PropTypes.object.isRequired,
  titlesFacets: PropTypes.object,
};

const ActionMenu = ({
  searchType,
  tagsModelOfAlreadyAddedTags,
  searchByTagsEnabled,
  searchByAccessTypesEnabled,
  query,
  accessTypes,
  standaloneFiltersEnabled,
  params,
  prevDataOfOptedPackage,
  results,
  titlesFacets,
  packagesFacetCollection,
  filterCount,
  onFilterChange,
  onToggleFilter,
  onToggleActions,
  onStandaloneFilterChange,
}) => {
  const intl = useIntl();

  const Filters = searchFiltersComponents[searchType];

  // sort is treated separately from the rest of the filters on submit,
  // but treated together when rendering the filters.
  const combinedFilters = {
    sort: query.sort,
    ...query.filter,
  };

  const handleStandaloneFilterChange = filter => {
    const formattedFilter = {
      [filter.name]: filter.values || undefined,
    };

    onStandaloneFilterChange(formattedFilter);
  };

  const getSortedDataOptions = () => {
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
  };

  const renderAccessTypesFilter = () => {
    const accessStatusTypesExist = !!accessTypes?.items?.data?.length;
    const isPackagesOrTitlesSearchType = [searchTypes.PACKAGES, searchTypes.TITLES].includes(searchType);

    const accessTypesDataOptions = accessTypes?.items?.data?.map(({ attributes }) => ({
      value: attributes.name,
      label: attributes.name,
    }));

    if (isPackagesOrTitlesSearchType && accessStatusTypesExist) {
      return (
        <AccessTypesFilter
          accessTypesStoreData={accessTypes}
          searchByAccessTypesEnabled={searchByAccessTypesEnabled}
          selectedValues={getAccessTypesList(query.filter?.['access-type'])}
          onStandaloneFilterChange={onStandaloneFilterChange}
          onStandaloneFilterToggle={onToggleFilter}
          dataOptions={accessTypesDataOptions}
          handleStandaloneFilterChange={handleStandaloneFilterChange}
          showClearButton
        />
      );
    }

    return null;
  };

  const renderActionMenu = () => {
    const tagsOptions = getSortedDataOptions();

    return (
      <div>
        <IfPermission perm="ui-tags.all">
          <TagsFilter
            isLoading={tagsModelOfAlreadyAddedTags.isLoading}
            selectedValues={getTagsList(query.filter?.tags, tagsOptions)}
            searchByTagsEnabled={searchByTagsEnabled}
            onStandaloneFilterChange={onStandaloneFilterChange}
            onStandaloneFilterToggle={onToggleFilter}
            handleStandaloneFilterChange={handleStandaloneFilterChange}
            dataOptions={tagsOptions}
            showClearButton
          />
        </IfPermission>
        {renderAccessTypesFilter()}
        <Filters
          activeFilters={combinedFilters}
          params={params}
          prevDataOfOptedPackage={prevDataOfOptedPackage}
          resultsLength={results.length}
          isResultsLoading={results.isLoading}
          titlesFacets={titlesFacets}
          isPackagesLoading={packagesFacetCollection.isLoading}
          onUpdate={onFilterChange}
          disabled={standaloneFiltersEnabled}
          hasAccordion={false}
        />
      </div>
    );
  };

  const renderActionMenuContent = () => (
    <DropdownMenu>
      {renderActionMenu()}
    </DropdownMenu>
  );

  const renderActionMenuToggle = ({ onToggle, triggerRef, keyHandler, open, ariaProps, getTriggerProps }) => {
    const handleActionMenuToggle = (e) => {
      onToggleActions(!open);
      onToggle(e);
    };

    return (
      <div className={styles.actionMenuToggle}>
        <Button
          buttonStyle="primary"
          marginBottom0
          onKeyDown={keyHandler}
          ref={triggerRef}
          {...getTriggerProps()}
          {...ariaProps}
          onClick={handleActionMenuToggle}
        >
          <Icon icon={open ? 'triangle-up' : 'triangle-down'} iconPosition="end">
            <FormattedMessage id="stripes-components.paneMenuActionsToggleLabel" />
          </Icon>
        </Button>
        {filterCount > 0 && (
          <Tooltip
            text={intl.formatMessage({ id: 'ui-eholdings.actionMenu.filterBadgeTooltip' }, { count: filterCount })}
            id="filter-badge-tooltip"
          >
            {({ ref, ariaIds }) => (
              <div
                ref={ref}
                aria-labelledby={ariaIds.text}
              >
                <Badge>
                  {filterCount}
                </Badge>
              </div>
            )}
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <Dropdown
      hasPadding
      label={intl.formatMessage({ id: 'ui-eholdings.actionMenu.label' })}
      buttonProps={{
        buttonStyle: 'primary',
      }}
      modifiers={{
        preventOverflow: { boundariesElement: 'scrollParent', padding: 5 },
      }}
      placement="bottom-end"
      renderTrigger={renderActionMenuToggle}
      renderMenu={renderActionMenuContent}
    />
  );
};

ActionMenu.propTypes = propTypes;

export { ActionMenu };

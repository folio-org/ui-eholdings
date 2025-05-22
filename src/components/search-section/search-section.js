import {
  useRef,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  SearchField,
  Select
} from '@folio/stripes/components';

import { ActionMenu } from './action-menu';
import {
  searchableIndexes,
  searchTypes,
} from '../../constants';
import {
  filterCountFromQuery,
  normalize,
} from '../utilities';

import styles from './search-section.css';

const EMPTY_OBJECT = {};

const propTypes = {
  accessTypes: PropTypes.object.isRequired,
  onFilter: PropTypes.func.isRequired,
  onToggleActions: PropTypes.func.isRequired,
  packagesFacetCollection: PropTypes.object,
  params: PropTypes.object,
  prevDataOfOptedPackage: PropTypes.object,
  queryProp: PropTypes.object.isRequired,
  results: PropTypes.object,
  searchType: PropTypes.string.isRequired,
  tagsModelOfAlreadyAddedTags: PropTypes.object,
  titlesFacets: PropTypes.object,
};

const SearchSection = ({
  searchType,
  queryProp,
  tagsModelOfAlreadyAddedTags,
  accessTypes,
  params = EMPTY_OBJECT,
  prevDataOfOptedPackage = EMPTY_OBJECT,
  results = EMPTY_OBJECT,
  titlesFacets = EMPTY_OBJECT,
  packagesFacetCollection = EMPTY_OBJECT,
  onFilter,
  onToggleActions,
}) => {
  const intl = useIntl();

  const queryContainsTagsFilter = !!queryProp?.filter?.tags;
  const queryContainsAccessTypesFilter = !!queryProp?.filter['access-type'];

  const searchFieldRef = useRef(null);
  const [query, setQuery] = useState(normalize(queryProp));
  const [searchByTagsEnabled, setSearchByTagsEnabled] = useState(queryContainsTagsFilter);
  const [searchByAccessTypesEnabled, setSearchByAccessTypesEnabled] = useState(queryContainsAccessTypesFilter && !queryContainsTagsFilter);

  const standaloneFiltersEnabled = searchByTagsEnabled || searchByAccessTypesEnabled;
  const queryFromProps = normalize(queryProp);
  const filterCount = filterCountFromQuery(queryFromProps);

  const updateFilter = (_query) => {
    let searchQuery;

    if (!searchByTagsEnabled && _query.q !== '') {
      searchQuery = _query.q;
    }

    const filter = { ..._query.filter };

    if (!searchByTagsEnabled) {
      filter.tags = undefined;
    }

    if (!searchByAccessTypesEnabled) {
      filter['access-type'] = undefined;
    }

    onFilter({
      ..._query,
      filter,
      q: searchQuery,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter(query);
  };

  const handleSearchFieldChange = (e) => {
    setQuery(cur => normalize({
      ...cur,
      searchfield: e.target.value,
    }));
  };

  const handleSearchQueryChange = e => {
    setQuery(cur => ({
      ...cur,
      q: e.target.value,
    }));
  };

  const handleClearSearch = () => {
    setQuery(cur => ({
      ...cur,
      q: '',
    }));
    updateFilter('');
  };

  const toggleFilter = filterName => () => {
    if (filterName === 'access-type') {
      setSearchByAccessTypesEnabled(cur => !cur);
      setSearchByTagsEnabled(false);
    } else {
      setSearchByTagsEnabled(cur => !cur);
      setSearchByAccessTypesEnabled(false);
    }
  };

  const handleStandaloneFilterChange = filter => {
    setQuery(cur => {
      const newQuery = normalize({
        sort: cur.sort,
        filter,
      });

      updateFilter(newQuery);

      return newQuery;
    });
  };

  const handleFilterChange = (args) => {
    const { sort, ...filter } = args;

    setQuery(cur => {
      const newQuery = normalize({
        sort,
        filter,
        searchfield: cur.searchfield,
        q: cur.q,
      });

      updateFilter(newQuery);

      return newQuery;
    });
  };

  return (
    <div className={styles.container}>
      {searchType === searchTypes.TITLES && (
        <Select
          marginBottom0
          onChange={handleSearchFieldChange}
          value={query.searchfield}
          aria-label={intl.formatMessage({ id: 'ui-eholdings.search.selectFieldToSearch' })}
          data-testid="field-to-search-select"
        >
          {Object.values(searchableIndexes).map(value => (
            <option
              key={value}
              value={value}
            >
              {intl.formatMessage({ id: `ui-eholdings.label.${value}` })}
            </option>
          ))}
        </Select>
      )}
      <form
        onSubmit={handleSearchSubmit}
        aria-labelledby={searchType + '-tab'}
        id="search-form"
      >
        <SearchField
          id="eholdings-search"
          name="search"
          inputRef={searchFieldRef}
          marginBottom0
          onChange={handleSearchQueryChange}
          onClear={handleClearSearch}
          value={query.q}
          placeholder={intl.formatMessage({ id: `ui-eholdings.search.searchType.${searchType}` })}
          disabled={standaloneFiltersEnabled}
          ariaLabel={intl.formatMessage({ id: 'ui-eholdings.search.enterYourSearch' })}
        />
      </form>
      <ActionMenu
        searchType={searchType}
        onStandaloneFilterChange={handleStandaloneFilterChange}
        onToggleActions={onToggleActions}
        tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
        searchByTagsEnabled={searchByTagsEnabled}
        searchByAccessTypesEnabled={searchByAccessTypesEnabled}
        query={query}
        accessTypes={accessTypes}
        standaloneFiltersEnabled={standaloneFiltersEnabled}
        onToggleFilter={toggleFilter}
        params={params}
        prevDataOfOptedPackage={prevDataOfOptedPackage}
        results={results}
        titlesFacets={titlesFacets}
        packagesFacetCollection={packagesFacetCollection}
        onFilterChange={handleFilterChange}
        filterCount={filterCount}
      />
    </div>
  );
};

SearchSection.propTypes = propTypes;

export { SearchSection };

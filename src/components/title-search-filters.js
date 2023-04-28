import PropTypes from 'prop-types';
import SearchFilters from './search-form/search-filters';
import PackagesFilter from './search-form/components/packages-filter';
import {
  titleSortFilterConfig,
  selectionStatusFilterConfig,
  publicationTypeFilterConfig,
} from '../constants';

const propTypes = {
  activeFilters: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  packagesFacetCollection: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  prevDataOfOptedPackage: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired,
  titlesFacets: PropTypes.object.isRequired,
};

/**
 * Renders search filters with specific title filters.
 *
 * Once the API supports returning these filters via an endpoint, this
 * component should not be necessary. Instead the `search-form` should
 * recieve the available filters from the route and render the
 * search-filters component itself.
 */
function TitleSearchFilters(props) {
  const {
    activeFilters,
    disabled,
    params,
    prevDataOfOptedPackage,
    results,
    packagesFacetCollection,
    titlesFacets,
    onUpdate,
  } = props;

  return (
    <>
      <SearchFilters
        searchType="titles"
        availableFilters={[
          titleSortFilterConfig,
          selectionStatusFilterConfig,
          publicationTypeFilterConfig,
        ]}
        {...props}
      />
      <PackagesFilter
        activeFilters={activeFilters}
        disabled={disabled}
        params={params}
        prevDataOfOptedPackage={prevDataOfOptedPackage}
        results={results}
        titlesFacets={titlesFacets}
        packagesFacetCollection={packagesFacetCollection}
        onUpdate={onUpdate}
      />
    </>
  );
}

TitleSearchFilters.propTypes = propTypes;

export default TitleSearchFilters;

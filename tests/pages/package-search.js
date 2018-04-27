import {
  action,
  property,
  clickable,
  collection,
  computed,
  fillable,
  isPresent,
  interactor,
  value,
  text,
  is
} from '@bigtest/interactor';

@interactor class PackageSearchPage {
  fillSearch = fillable('[data-test-search-field] input[name="search"]');
  submitSearch = clickable('[data-test-search-submit]');
  isSearchDisabled = property('[data-test-search-submit]', 'disabled');
  hasSearchField = isPresent('[data-test-search-field] input[name="search"]');
  hasSearchFilters = isPresent('[data-test-eholdings-search-filters="packages"]');
  searchFieldValue = value('[data-test-search-field] input[name="search"]');
  titleSearchFieldValue = value('[data-test-title-search-field] input[name="search"]');
  hasResults = isPresent('[data-test-eholdings-search-results-header]');
  totalResults = text('[data-test-eholdings-search-results-header] p');
  packagePreviewPaneIsPresent = isPresent('[data-test-preview-pane="packages"]');
  titlePreviewPaneIsPresent = isPresent('[data-test-preview-pane="titles"]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button] button');
  clickSearchVignette = clickable('[data-test-search-vignette]');
  hasErrors = isPresent('[data-test-query-list-error="packages"]');
  errorMessage = text('[data-test-query-list-error="packages"]');
  noResultsMessage = text('[data-test-query-list-not-found="packages"]');
  selectedSearchType = collection('[data-test-search-form-type-switcher] a[class^="is-active--"]');
  sortBy = value('[data-test-eholdings-search-filters="packages"] input[name="sort"]:checked');
  clickCloseButton = clickable('[data-test-eholdings-details-view-close-button] a');
  hasPreSearchPane = isPresent('[data-test-eholdings-pre-search-pane]');

  hasLoaded = computed(function () {
    return this.packageList().length > 0;
  });

  changeSearchType = action(function (searchType) {
    return this.click(`[data-test-search-type-button="${searchType}"]`);
  });

  clickFilter = action(function (name, val) {
    return this.click(`[data-test-eholdings-search-filters="packages"] input[name="${name}"][value="${val}"]`);
  });

  clearFilter = action(function (name) {
    return this.click(`#filter-packages-${name} button[icon="clearX"]`);
  });

  getFilter(name) {
    return this.$(`[data-test-eholdings-search-filters="packages"] input[name="${name}"]:checked`).value;
  }

  scrollToOffset = action(function (readOffset) {
    return this.find('[data-test-query-list="packages"] li')
      .do((firstItem) => {
        return this.scroll('[data-test-query-list="packages"]', {
          top: firstItem.offsetHeight * readOffset
        });
      });
  });

  search = action(function (query) {
    return this
      .fillSearch(query)
      .submitSearch();
  });

  packageList = collection('[data-test-eholdings-package-list-item]', {
    name: text('[data-test-eholdings-package-list-item-name]'),
    providerName: text('[data-test-eholdings-package-list-item-provider-name]'),
    isSelectedText: text('[data-test-eholdings-package-list-item-selected]'),
    isSelected: computed(function () {
      return this.isSelectedText === 'Selected';
    }),
    isActive: is(this.$root, '[class*="is-selected"]'),
    clickThrough: clickable()
  });

  packageTitleList = collection('[data-test-query-list="package-titles"] li', {
    clickToTitle: clickable('a')
  });
}

export default new PackageSearchPage('[data-test-eholdings]');

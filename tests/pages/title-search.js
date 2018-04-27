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
import { isRootPresent, hasClassBeginningWith } from './helpers';

@interactor class TitleSearchPage {
  exists = isRootPresent();
  fillSearch = fillable('[data-test-title-search-field] input[name="search"]');
  submitSearch = clickable('[data-test-search-submit]');
  isSearchButtonDisabled = property('[data-test-search-submit]', 'disabled');
  fillSearch = fillable('[data-test-title-search-field] input[name="search"]');
  submitSearch = clickable('[data-test-search-submit]');
  hasSearchField = isPresent('[data-test-title-search-field] input[name="search"]');
  searchFieldValue = value('[data-test-title-search-field] input[name="search"]');
  providerOrPackageSearchFieldValue = value('[data-test-search-field] input[name="search"]');
  searchFieldSelectValue = value('[data-test-title-search-field] select');
  hasSearchFilters = isPresent('[data-test-eholdings-search-filters="titles"]');
  totalResults = text('[data-test-eholdings-search-results-header] p');
  titlePreviewPaneIsPresent = isPresent('[data-test-preview-pane="titles"]');
  providerPreviewPaneIsPresent = isPresent('[data-test-preview-pane="providers"]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button] button');
  clickSearchVignette = clickable('[data-test-search-vignette]');
  hasErrors = isPresent('[data-test-query-list-error="titles"]');
  errorMessage = text('[data-test-query-list-error="titles"]');
  noResultsMessage = text('[data-test-query-list-not-found="titles"]');
  selectedSearchType = collection('[data-test-search-form-type-switcher] a[class^="is-active--"]');
  isSearchVignetteHidden = hasClassBeginningWith('[data-test-search-vignette]', 'is-hidden--');
  clickCloseButton = clickable('[data-test-eholdings-details-view-close-button] a');
  hasPreSearchPane = isPresent('[data-test-eholdings-pre-search-pane]');

  hasLoaded = computed(function () {
    return this.titleList().length > 0;
  });

  scrollToOffset = action(function (readOffset) {
    return this.find('[data-test-query-list="titles"] li')
      .do((firstItem) => {
        return this.scroll('[data-test-query-list="titles"]', {
          top: firstItem.offsetHeight * readOffset
        });
      });
  });

  selectSearchField = action(function (searchfield) {
    return this.fill('[data-test-title-search-field] select', searchfield);
  });

  search = action(function (query) {
    return this
      .fillSearch(query)
      .submitSearch();
  });

  getFilter(name) {
    return this.$(`[data-test-eholdings-search-filters="titles"] input[name="${name}"]:checked`).value;
  }

  clickFilter = action(function (name, val) {
    return this.click(`[data-test-eholdings-search-filters="titles"] input[name="${name}"][value="${val}"]`);
  });

  clearFilter = action(function (name) {
    return this.click(`#filter-titles-${name} button[icon="clearX"]`);
  });

  changeSearchType = action(function (searchType) {
    return this.click(`[data-test-search-type-button="${searchType}"]`);
  });

  clearSearch = action(function () {
    return this.fillSearch('');
  });

  titleList = collection('[data-test-eholdings-title-list-item]', {
    name: text('[data-test-eholdings-title-list-item-title-name]'),
    publisherName: text('[data-test-eholdings-title-list-item-publisher-name]'),
    publicationType: text('[data-test-eholdings-title-list-item-publication-type]'),
    clickThrough: clickable(),
    isActive: is(this.$root, '[class*="is-selected--"]')
  });

  packageTitleList = collection('[data-test-query-list="title-packages"] li', {
    clickToPackage: clickable('a')
  });
}

export default new TitleSearchPage('[data-test-eholdings]');

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

import TagsAccordion from './tags-accordion';

import Toast from './toast';
import SearchBadge from './search-badge';

@interactor class PackageSearchPage {
  fillSearch = fillable('[data-test-search-field] input[name="search"]');
  submitSearch = clickable('[data-test-search-submit]');
  isSearchDisabled = property('[data-test-search-submit]', 'disabled');
  hasSearchField = isPresent('[data-test-search-field] input[name="search"]');
  hasSearchFilters = isPresent('[data-test-eholdings-search-filters="packages"]');
  hasTagFilter = isPresent('[data-test-eholdings-tag-filter]');
  searchFieldValue = value('[data-test-search-field] input[name="search"]');
  titleSearchFieldValue = value('[data-test-search-field] input[name="search"]');
  hasResults = isPresent('[data-test-results-pane] [data-test-pane-header] p');
  totalResults = text('[data-test-results-pane] [data-test-pane-header] p');
  paneTitleHasFocus = is('[data-test-results-pane] [data-test-pane-header] h2 [tabindex]', ':focus');
  packagePreviewPaneIsPresent = isPresent('[data-test-preview-pane="packages"]');
  titlePreviewPaneIsPresent = isPresent('[data-test-preview-pane="titles"]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  clickSearchVignette = clickable('[data-test-pane-vignette]');
  hasErrors = isPresent('[data-test-query-list-error="packages"]');
  errorMessage = text('[data-test-query-list-error="packages"]');
  noResultsMessage = text('[data-test-query-list-not-found="packages"]');
  selectedSearchType = collection([
    '[data-test-search-form-type-switcher] a[class^="primary--"]',
    '[data-test-search-form-type-switcher] a[class*=" primary--"]'
  ].join(','));

  sortBy = value('[data-test-eholdings-search-filters="packages"] input[name="sort"]:checked');
  clickCloseButton = clickable('[data-test-eholdings-details-view-close-button]');
  hasPreSearchPane = isPresent('[data-test-eholdings-pre-search-pane]');
  searchBadge = new SearchBadge('[data-test-eholdings-results-pane-search-badge]');
  isSearchPanePresent = isPresent('[data-test-eholdings-search-pane]');
  clickNewButton = clickable('[data-test-eholdings-search-new-button]');
  tagsSection = new TagsAccordion('[data-test-eholdings-tag-filter]');

  toast = Toast;

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
    return this.click(`#filter-packages-${name} button[icon="times-circle-solid"]`);
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
    isActive: is('[class*="is-selected"]'),
    hasFocus: is(':focus'),
    clickThrough: clickable()
  });

  packageTitleList = collection('[data-test-query-list="package-titles"] li', {
    clickToTitle: clickable('a')
  });
}

export default new PackageSearchPage('[data-test-eholdings]');

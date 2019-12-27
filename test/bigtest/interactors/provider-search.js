import {
  action,
  clickable,
  collection,
  computed,
  fillable,
  isPresent,
  is,
  property,
  interactor,
  value,
  text
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import TagsAccordion from './tags-accordion';

@interactor class ProviderSearchPage {
  fillSearch = fillable('[data-test-search-field] input[name="search"]');
  submitSearch = clickable('[data-test-search-submit]');
  hasSearchField = isPresent('[data-test-search-field] input[name="search"]');
  searchFieldIsDisabled = property('[data-test-search-field] input[name="search"]', 'disabled');
  hasSearchFilters = isPresent('[data-test-eholdings-search-filters="providers"]');
  hasTagFilter = isPresent('[data-test-eholdings-tag-filter]');
  searchFieldValue = value('[data-test-search-field] input[name="search"]');
  totalResults = text('#paneHeadersearch-results-subtitle span');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  clickSearchVignette = clickable('[data-test-pane-vignette]');
  clickBackButton = clickable('[data-test-eholdings-details-view-back-button]');
  hasErrors = isPresent('[data-test-query-list-error="providers"]');
  errorMessage = text('[data-test-query-list-error="providers"]');
  noResultsMessage = text('[data-test-query-list-not-found="providers"]');
  selectedSearchType = collection([
    '[data-test-search-form-type-switcher] a[class^="primary--"]',
    '[data-test-search-form-type-switcher] a[class*=" primary--"]'
  ].join(','));

  sortBy = value('[data-test-eholdings-search-filters="providers"] input[name="sort"]:checked');
  isSearchButtonDisabled = property('[data-test-search-submit]', 'disabled');
  isSearchVignetteHidden = isPresent('[data-test-pane-vignette]');
  hasPreSearchPane = isPresent('[data-test-eholdings-pre-search-pane]');
  tagsSection = new TagsAccordion('[data-test-eholdings-tag-filter]');
  sortFilterAccordion = new AccordionInteractor('#filter-providers-sort');
  hasLoaded = computed(function () {
    return this.providerList().length > 0;
  })

  changeSearchType = action(function (searchType) {
    return this.click(`[data-test-search-type-button="${searchType}"]`);
  })

  toggleAccordion = action(function (accordionId) {
    return this.click(accordionId);
  });

  clickFilter = action(function (name, val) {
    return this.click(`[data-test-eholdings-search-filters="providers"] input[name="${name}"][value="${val}"]`);
  })

  clearSearch = action(function () {
    return this.fillSearch('');
  })

  scrollToOffset = action(function (readOffset) {
    return this.find('[data-test-query-list="providers"] li')
      .do((firstItem) => {
        const scrollOffset = firstItem.offsetHeight * readOffset;
        return this.scroll('[data-test-query-list="providers"]', { top: scrollOffset });
      })
      .run();
  })

  search(query) {
    return this
      .fillSearch(query)
      .submitSearch();
  }

  providerList = collection('[data-test-eholdings-provider-list-item]', {
    name: text('[data-test-eholdings-provider-list-item-name]'),
    numPackages: text('[data-test-eholdings-provider-list-item-num-packages-total]'),
    providerName: text('[data-test-eholdings-package-list-item-provider-name]'),
    numPackagesSelected: text('[data-test-eholdings-provider-list-item-num-packages-selected]'),
    isActive: is('[class*="is-selected"]'),
    hasFocus: is(':focus'),
    clickThrough: clickable()
  });

  providerPackageList = collection('[data-test-query-list="provider-packages"] li', {
    clickToPackage: clickable('a')
  });
}

export default new ProviderSearchPage('[data-test-eholdings]');

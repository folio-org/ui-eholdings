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

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import TagsAccordion from './tags-accordion';
import AccessTypesAccordion from './access-types-accordion';

@interactor class TitleSearchPage {
  fillSearch = fillable('[data-test-search-field] input[name="search"]');
  submitSearch = clickable('[data-test-search-submit]');
  isSearchDisabled = property('[data-test-search-submit]', 'disabled');
  searchFieldIsDisabled = property('[data-test-search-field] input[name="search"]', 'disabled');
  isSearchButtonDisabled = property('[data-test-search-submit]', 'disabled');
  fillSearch = fillable('[data-test-search-field] input[name="search"]');
  submitSearch = clickable('[data-test-search-submit]');
  hasSearchField = isPresent('[data-test-search-field] input[name="search"]');
  hasTagFilter = isPresent('[data-test-eholdings-tag-filter]');
  searchFieldValue = value('[data-test-search-field] input[name="search"]');
  providerOrPackageSearchFieldValue = value('[data-test-search-field] input[name="search"]');
  searchFieldSelectValue = value('[data-test-search-field] select');
  hasSearchFilters = isPresent('[data-test-eholdings-search-filters="titles"]');
  totalResults = text('#paneHeadersearch-results-subtitle span');
  sortBy = value('[data-test-eholdings-search-filters="titles"] input[name="sort"]:checked');

  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  clickSearchVignette = clickable('[data-test-pane-vignette]');
  hasErrors = isPresent('[data-test-query-list-error="titles"]');
  errorMessage = text('[data-test-query-list-error="titles"]');
  noResultsMessage = text('[data-test-query-list-not-found="titles"]');
  selectedSearchType = collection([
    '[data-test-search-form-type-switcher] a[class^="primary--"]',
    '[data-test-search-form-type-switcher] a[class*=" primary--"]'
  ].join(','));

  isSearchVignetteHidden = isPresent('[data-test-pane-vignette]');
  hasPreSearchPane = isPresent('[data-test-eholdings-pre-search-pane]');
  clickNewButton = clickable('[data-test-eholdings-search-new-button]');
  tagsSection = new TagsAccordion('[data-test-eholdings-tag-filter]');
  accessTypesSection = new AccessTypesAccordion('[data-test-eholdings-access-types-filter]');
  sortFilterAccordion = new AccordionInteractor('#filter-titles-sort');
  selectionFilterAccordion = new AccordionInteractor('#filter-titles-selected');
  typeFilterAccordion = new AccordionInteractor('#filter-titles-type');

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

  toggleAccordion = action(function (accordionId) {
    return this.click(accordionId);
  });

  selectSearchField = action(function (searchfield) {
    return this.fill('[data-test-search-field] select', searchfield);
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
    return this.click(`#filter-titles-${name} button[icon="times-circle-solid"]`);
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
    contributorsList: text('[data-test-eholdings-contributors-inline-list-item]'),
    hasIdentifiers: isPresent('[data-test-eholdings-identifiers-inline-list-item]'),
    identifiersList: text('[data-test-eholdings-identifiers-inline-list-item]'),
    clickThrough: clickable(),
    isActive: is('[class*="is-selected--"]'),
    hasFocus: is(':focus')
  });

  packageTitleList = collection('[data-test-query-list="title-packages"] li', {
    clickToPackage: clickable('a')
  });
}

export default new TitleSearchPage('[data-test-eholdings]');

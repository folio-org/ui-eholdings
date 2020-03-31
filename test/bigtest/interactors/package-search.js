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
  is,
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

import TagsAccordion from './tags-accordion';
import AccessStatusTypesFilter from './accessTypesFilterAccordion';

import Toast from './toast';
import ExpandFilterPaneButtonInteractor from './expand-filter-pane-button';

@interactor class PackageSearchPage {
  fillSearch = fillable('[data-test-search-field] input[name="search"]');
  submitSearch = clickable('[data-test-search-submit]');
  isSearchDisabled = property('[data-test-search-submit]', 'disabled');
  hasSearchField = isPresent('[data-test-search-field] input[name="search"]');
  searchFieldIsDisabled = property('[data-test-search-field] input[name="search"]', 'disabled');
  hasSearchFilters = isPresent('[data-test-eholdings-search-filters="packages"]');
  hasTagFilter = isPresent('[data-test-eholdings-tag-filter]');
  searchFieldValue = value('[data-test-search-field] input[name="search"]');
  titleSearchFieldValue = value('[data-test-search-field] input[name="search"]');
  hasResults = isPresent('#paneHeadersearch-results-subtitle');
  totalResults = text('#paneHeadersearch-results-subtitle span');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  clickSearchVignette = clickable('[data-test-pane-vignette]');
  hasErrors = isPresent('[data-test-query-list-error="packages"]');
  errorMessage = text('[data-test-query-list-error="packages"]');
  noResultsMessage = text('[data-test-query-list-not-found="packages"]');
  selectedSearchType = collection([
    '[data-test-search-form-type-switcher] a[class^="primary--"]',
    '[data-test-search-form-type-switcher] a[class*=" primary--"]'
  ].join(','));

  sortFilterAccordion = new AccordionInteractor('#filter-packages-sort');
  selectionFilterAccordion = new AccordionInteractor('#filter-packages-selected');
  typeFilterAccordion = new AccordionInteractor('#filter-packages-type');
  sortBy = value('[data-test-eholdings-search-filters="packages"] input[name="sort"]:checked');
  hasPreSearchPane = isPresent('[data-test-eholdings-pre-search-pane]');
  collapseFilterPaneButton = new ButtonInteractor('[data-test-collapse-filter-pane-button]');
  expandFilterPaneButton = new ExpandFilterPaneButtonInteractor();
  isSearchPanePresent = isPresent('[data-test-eholdings-search-pane]');
  clickNewButton = clickable('[data-test-eholdings-search-new-button]');
  tagsSection = new TagsAccordion('[data-test-eholdings-tag-filter]');
  accessStatusTypesSection = new AccessStatusTypesFilter('[data-test-eholdings-access-types-filter]');

  toast = Toast;

  hasLoaded = computed(function () {
    return this.packageList().length > 0;
  });

  changeSearchType = action(function (searchType) {
    return this.click(`[data-test-search-type-button="${searchType}"]`);
  });

  toggleAccordion = action(function (accordionId) {
    return this.click(accordionId);
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
      return this.isSelectedText.split(' ')[0] === 'Selected:';
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

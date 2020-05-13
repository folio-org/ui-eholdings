import {
  interactor,
  action,
  attribute,
  clickable,
  property,
  value,
  fillable,
  selectable,
  collection,
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import TagsAccordion from './tags-accordion';
import AccessTypesAccordion from './access-types-accordion';

export default @interactor class SearchModal {
  searchType = attribute('data-test-search-form', '[data-test-search-form]')
  searchFieldValue = value('[data-test-search-field] input[name="search"]');
  searchFieldIsDisabled = property('[data-test-search-field] input[name="search"]', 'disabled');
  isSearchButtonDisabled = property('[data-test-eholdings-modal-search-button]', 'disabled');
  isResetButtonDisabled = property('[data-test-eholdings-modal-reset-all-button]', 'disabled');
  clickResetAll = clickable('[data-test-eholdings-modal-reset-all-button]');
  searchTitles = fillable('[data-test-search-field] input[name="search"]');
  selectSearchField = selectable('[data-test-search-field] select');
  searchDisabled = property('[data-test-search-submit]', 'disabled')
  clickSearch = clickable('[data-test-eholdings-modal-search-button]');
  sortBy = value('[data-test-eholdings-search-filters="titles"] input[name="sort"]:checked');
  resetSortFilter = clickable('#filter-titles-sort button[icon="times-circle-solid"]');
  tagsSection = new TagsAccordion('[data-test-eholdings-tag-filter]');
  accessTypesSection = new AccessTypesAccordion('[data-test-eholdings-access-types-filter]');
  sortFilterAccordion = new AccordionInteractor('#filter-packages-sort');
  selectionFilterAccordion = new AccordionInteractor('#filter-packages-selected');
  typeFilterAccordion = new AccordionInteractor('#filter-packages-type');
  toggleAccordion = action(function (accordionId) {
    return this.click(accordionId);
  });

  filterAccordions = collection('[class^="accordion--"]', AccordionInteractor);

  clickFilter = action(function (name, val) {
    return this.click(`[data-test-eholdings-search-filters] input[name="${name}"][value="${val}"]`);
  });

  search = action(function (query) {
    return this
      .fill('[data-test-search-field] input[name="search"]', query)
      .click('[data-test-eholdings-modal-search-button]');
  });

  clearSearch = action(function () {
    return this
      .fill('[data-test-search-field] input[name="search"]', '');
  });

  getFilter(name) {
    return this.$(`[data-test-eholdings-search-filters] input[name="${name}"]:checked`).value;
  }
}

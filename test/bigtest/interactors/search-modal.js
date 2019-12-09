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
  sortFilterAccordion = new AccordionInteractor('#filter-packages-sort');
  selectionFilterAccordion = new AccordionInteractor('#filter-packages-selected');
  typeFilterAccordion = new AccordionInteractor('#filter-packages-type');
  toggleAccordion = action(async function (accordionId) {
    await this.click(accordionId);

    return this;
  });

  filterAccordions = collection('[class^="accordion--"]', AccordionInteractor);

  clickFilter = action(async function (name, val) {
    await this.click(`[data-test-eholdings-search-filters] input[name="${name}"][value="${val}"]`);
    
    return this;
  });

  search = action(async function (query) {
    await this.fill('[data-test-search-field] input[name="search"]', query);
    await this.click('[data-test-eholdings-modal-search-button]');
    
    return this;
  });

  clearSearch = action(async function () {
    await this.fill('[data-test-search-field] input[name="search"]', '');

    return this;
  });

  getFilter(name) {
    return this.$(`[data-test-eholdings-search-filters] input[name="${name}"]:checked`).value;
  }
}

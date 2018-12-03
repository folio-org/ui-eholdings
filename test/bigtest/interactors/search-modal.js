import {
  interactor,
  action,
  attribute,
  clickable,
  property,
  value,
  fillable,
  selectable,
} from '@bigtest/interactor';

export default @interactor class SearchModal {
  searchType = attribute('data-test-search-form', '[data-test-search-form]')
  searchFieldValue = value('[data-test-search-field] input[name="search"]');
  isSearchButtonDisabled = property('[data-test-eholdings-modal-search-button]', 'disabled');
  isResetButtonDisabled = property('[data-test-eholdings-modal-reset-all-button]', 'disabled');
  clickResetAll = clickable('[data-test-eholdings-modal-reset-all-button]');
  searchTitles = fillable('[data-test-title-search-field] input[name="search"]');
  selectSearchField = selectable('[data-test-title-search-field] select');
  searchDisabled = property('[data-test-search-submit]', 'disabled')
  clickSearch = clickable('[data-test-eholdings-modal-search-button]');
  sortBy = value('[data-test-eholdings-search-filters="titles"] input[name="sort"]:checked');
  resetSortFilter = clickable('#filter-titles-sort button[icon="times-circle-solid"]');

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

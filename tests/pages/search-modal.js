import {
  interactor,
  action,
  attribute,
  clickable,
  property,
  value,
} from '@bigtest/interactor';

export default @interactor class SearchModal {
  searchType = attribute('data-test-search-form', '[data-test-search-form]')
  searchFieldValue = value('[data-test-search-field] input[name="search"]');

  clickFilter = action(function (name, val) {
    return this.click(`[data-test-eholdings-search-filters] input[name="${name}"][value="${val}"]`);
  });

  clickSearch = clickable('[data-test-eholdings-modal-search-button]');

  getFilter(name) {
    return this.$(`[data-test-eholdings-search-filters] input[name="${name}"]:checked`).value;
  }

  isSearchButtonDisabled = property('[data-test-eholdings-modal-search-button]', 'disabled');
  isResetButtonDisabled = property('[data-test-eholdings-modal-reset-all-button]', 'disabled');
  clickResetAll = clickable('[data-test-eholdings-modal-reset-all-button]');

  searchDisabled = property('[data-test-search-submit]', 'disabled')

  search = action(function (query) {
    return this
      .fill('[data-test-search-field] input[name="search"]', query)
      .click('[data-test-eholdings-modal-search-button]');
  });

  clearSearch = action(function () {
    return this
      .fill('[data-test-search-field] input[name="search"]', '');
  });
}

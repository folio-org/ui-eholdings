import {
  interactor,
  action,
  attribute,
  clickable,
  isPresent,
  property,
  value,
} from '@bigtest/interactor';

export default @interactor class SearchModal {
  searchType = attribute('data-test-search-form', '[data-test-search-form]')
  searchFieldValue = value('[data-test-search-field] input[name="search"]');

  clickFilter = action(function (name, val) {
    return this.click(`[data-test-eholdings-search-filters] input[name="${name}"][value="${val}"]`);
  });

  clickApply = clickable('[data-test-eholdings-apply-button] button');
  hasApplyButton = isPresent('[data-test-eholdings-apply-button]');

  getFilter(name) {
    return this.$(`[data-test-eholdings-search-filters] input[name="${name}"]:checked`).value;
  }

  searchDisabled = property('[data-test-search-submit]', 'disabled')

  search = action(function (query) {
    return this
      .fill('[data-test-search-field] input[name="search"]', query)
      .click('[data-test-search-submit]');
  });
}

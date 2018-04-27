import {
  interactor,
  action,
  attribute,
  value,
} from '@bigtest/interactor';
import { isRootPresent } from './helpers';

export default @interactor class SearchModal {
  exists = isRootPresent();
  searchType = attribute('data-test-search-form', '[data-test-search-form]')
  searchFieldValue = value('[data-test-search-field] input[name="search"]');

  clickFilter = action(function (name, val) {
    return this.click(`[data-test-eholdings-search-filters] input[name="${name}"][value="${val}"]`);
  });

  getFilter(name) {
    return this.$(`[data-test-eholdings-search-filters] input[name="${name}"]:checked`).value;
  }

  search = action(function (query) {
    return this
      .fill('[data-test-search-field] input[name="search"]', query)
      .click('[data-test-search-submit]');
  });
}

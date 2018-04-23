import {
  page,
  action,
  attribute,
  value,
} from '@bigtest/interaction';
import { isRootPresent } from './helpers';

export default @page class SearchModal {
  exists = isRootPresent();
  searchType = attribute('data-test-search-form', '[data-test-search-form]')
  searchFieldValue = value('[data-test-search-form] input[name="search"]');

  clickFilter = action(function (name, val) {
    return this.click(`[data-test-eholdings-search-filters] input[name="${name}"][value="${val}"]`);
  });

  getFilter(name) {
    return this.$(`[data-test-eholdings-search-filters] input[name="${name}"]:checked`).value;
  }

  selectSearchField = action(function (searchfield) {
    return this.fill('[data-test-title-search-field] select', searchfield);
  });

  search = action(function (query) {
    return this
      .fill('[data-test-search-form] input[name="search"]', query)
      .click('[data-test-search-submit]');
  });
}

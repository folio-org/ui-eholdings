import $ from 'jquery';
import { triggerChange } from '../helpers';

export default {
  get $root() {
    return $('[data-test-eholdings]');
  },

  get $searchField() {
    return $('[data-test-search-field]');
  },

  get $searchResultsItems() {
    return $('[data-test-vendor-search-results-list] li');
  },

  get hasErrors() {
    return $('[data-test-vendor-search-error-message]').length > 0;
  },

  get noResultsMessage() {
    return $('[data-test-vendor-search-no-results]').text();
  },

  search(query) {
    let $input = $('[data-test-search-field]').val(query);
    triggerChange($input.get(0));

    // allow `triggerChange` to take effect
    window.setTimeout(() => {
      $('[data-test-search-submit]').trigger('click');
    }, 1);
  }
};

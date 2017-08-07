import $ from 'jquery';
import { triggerChange } from '../helpers';

export default {
  get root() {
    return $('[data-test-eholdings]');
  },

  get searchField() {
    return $('[data-test-search-field]');
  },

  get searchResultsItems() {
    return $('[data-test-search-results-item]');
  },

  get hasErrors() {
    return $('[data-test-search-error-message]').length > 0;
  },

  get noResultsMessage() {
    return $('[data-test-search-no-results]').text();
  },

  search(query) {
    let $input = $('[data-test-search-field]').val(query);
    triggerChange($input.get(0));

    $('[data-test-search-submit]').trigger('click');
  }
}

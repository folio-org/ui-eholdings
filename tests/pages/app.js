import $ from 'jquery';
import { triggerChange } from '../helpers';

export default {
  get searchField() {
    return $('[data-test-search-field]');
  },

  get searchResultsItems() {
    return $('[data-test-search-results-item]');
  },

  search(query) {
    let $input = $('[data-test-search-field]').val(query);
    triggerChange($input.get(0));

    $('[data-test-search-submit]').trigger('click');
  }
}

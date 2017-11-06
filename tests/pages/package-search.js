import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '../it-will';
import { triggerChange } from '../helpers';

function createPackageObject(element) {
  let $scope = $(element);

  return {
    get name() {
      return $scope.find('[data-test-eholdings-package-list-item-name]').text();
    },

    get vendorName() {
      return $scope.find('[data-test-eholdings-package-list-item-vendor-name]').text();
    },

    get numTitles() {
      return parseInt($scope.find('[data-test-eholdings-package-list-item-num-titles]').text(), 10);
    },

    get numTitlesSelected() {
      return parseInt($scope.find('[data-test-eholdings-package-list-item-num-titles-selected]').text(), 10);
    }
  };
}

export default {
  get $root() {
    return $('[data-test-eholdings]');
  },

  get $searchField() {
    return $('[data-test-search-field]');
  },

  get $searchResultsItems() {
    return $('[data-test-package-search-results-list] li a');
  },

  get hasErrors() {
    return $('[data-test-package-search-error-message]').length > 0;
  },

  get noResultsMessage() {
    return $('[data-test-package-search-no-results]').text();
  },

  get previewPaneIsVisible() {
    return $('[data-test-preview-pane="packages"]').length === 1;
  },

  get packageList() {
    return $('[data-test-package-search-results-list] li').toArray().map(createPackageObject);
  },

  clickSearchVignette() {
    return $('[data-test-search-vignette]').trigger('click');
  },

  search(query) {
    let $input = $('[data-test-search-field]').val(query);
    triggerChange($input.get(0));

    // allow `triggerChange` to take effect
    window.setTimeout(() => {
      $('[data-test-search-submit]').trigger('click');
    }, 1);
  },

  changeSearchType(searchType) {
    $(`[data-test-search-type-button="${searchType}"]`).get(0).click();
    return convergeOn(() => expect($(`[data-test-search-form="${searchType}"]`)).to.exist);
  }
};

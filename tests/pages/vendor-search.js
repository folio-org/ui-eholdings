import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '../it-will';
import { triggerChange } from '../helpers';

function createVendorObject(element) {
  let $scope = $(element);

  return {
    get name() {
      return $scope.find('[data-test-eholdings-vendor-list-item-name]').text();
    },

    get numPackages() {
      return parseInt($scope.find('[data-test-eholdings-vendor-list-item-num-packages-total]').text(), 10);
    },

    get numPackagesSelected() {
      return parseInt($scope.find('[data-test-eholdings-vendor-list-item-num-packages-selected]').text(), 10);
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
    return $('[data-test-vendor-search-results-list] li a');
  },

  get hasErrors() {
    return $('[data-test-vendor-search-error-message]').length > 0;
  },

  get errorMessage() {
    return $('[data-test-vendor-search-error-message]').text();
  },

  get noResultsMessage() {
    return $('[data-test-vendor-search-no-results]').text();
  },

  get previewPaneIsVisible() {
    return $('[data-test-preview-pane="vendors"]').length === 1;
  },

  get vendorList() {
    return $('[data-test-vendor-search-results-list] li').toArray().map(createVendorObject);
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

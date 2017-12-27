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
    return $('[data-test-query-list="vendors"] li a');
  },

  get totalResults() {
    return $('[data-test-eholdings-total-search-results]').text();
  },

  get hasErrors() {
    return $('[data-test-query-list-error="vendors"]').length > 0;
  },

  get errorMessage() {
    return $('[data-test-query-list-error="vendors"]').text();
  },

  get noResultsMessage() {
    return $('[data-test-query-list-not-found="vendors"]').text();
  },

  get previewPaneIsVisible() {
    return $('[data-test-preview-pane="vendors"]').length === 1;
  },

  get vendorList() {
    return this.$searchResultsItems.toArray().map(createVendorObject);
  },

  get $backButton() {
    return $('[data-test-eholdings-vendor-details-back-button');
  },

  clickSearchVignette() {
    return $('[data-test-search-vignette]').trigger('click');
  },

  search(query) {
    let $input = $('[data-test-search-field]').val(query);
    triggerChange($input.get(0));

    return convergeOn(() => {
      expect($input).to.have.value(query);
    }).then(() => {
      $('[data-test-search-submit]').trigger('click');
    });
  },

  changeSearchType(searchType) {
    $(`[data-test-search-type-button="${searchType}"]`).get(0).click();
    return convergeOn(() => expect($(`[data-test-search-form="${searchType}"]`)).to.exist);
  },

  clickPackage(index) {
    let $pkg = null;

    // wait until the item exists before clicking
    return convergeOn(() => {
      $pkg = $('[data-test-eholdings-package-list-item] a');
      expect($pkg.eq(index)).to.exist;
    }).then(() => $pkg.get(index).click());
  },

  clickBackButton() {
    return $('[data-test-eholdings-package-details-back-button]').trigger('click');
  },

  scrollToOffset(readOffset) {
    let $list = $('[data-test-query-list="vendors"]').get(0);
    let rowHeight = $('li', $list).get(0).offsetHeight;
    let scrollOffset = rowHeight * readOffset;

    $list.scrollTop = scrollOffset;
    $list.dispatchEvent(new Event('scroll'));
  }
};

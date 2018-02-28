import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '../it-will';
import { triggerChange } from '../helpers';

function createProviderObject(element) {
  let $scope = $(element);

  return {
    get name() {
      return $scope.find('[data-test-eholdings-provider-list-item-name]').text();
    },

    get numPackages() {
      return parseInt($scope.find('[data-test-eholdings-provider-list-item-num-packages-total]').text(), 10);
    },

    get numPackagesSelected() {
      return parseInt($scope.find('[data-test-eholdings-provider-list-item-num-packages-selected]').text(), 10);
    },

    get isActive() {
      return $scope.attr('class').indexOf('is-selected---') !== -1;
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
    return $('[data-test-query-list="providers"] li a');
  },

  get totalResults() {
    return $('[data-test-eholdings-search-results-header] p').text();
  },

  get hasErrors() {
    return $('[data-test-query-list-error="providers"]').length > 0;
  },

  get errorMessage() {
    return $('[data-test-query-list-error="providers"]').text();
  },

  get noResultsMessage() {
    return $('[data-test-query-list-not-found="providers"]').text();
  },

  get previewPaneIsVisible() {
    return $('[data-test-preview-pane="providers"]').length === 1;
  },

  get providerList() {
    return this.$searchResultsItems.toArray().map(createProviderObject);
  },

  get $backButton() {
    return $('[data-test-eholdings-provider-details-back-button] button');
  },

  get $selectedSearchType() {
    return $('[data-test-search-form-type-switcher] a[class^="is-active--"]');
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
      $pkg = $('[data-test-query-list="provider-packages"] li a');
      expect($pkg.eq(index)).to.exist;
    }).then(() => $pkg.get(index).click());
  },

  clickBackButton() {
    return $('[data-test-eholdings-package-details-back-button] button').trigger('click');
  },

  scrollToOffset(readOffset) {
    let $list = $('[data-test-query-list="providers"]').get(0);
    let rowHeight = $('li', $list).get(0).offsetHeight;
    let scrollOffset = rowHeight * readOffset;

    $list.scrollTop = scrollOffset;
    $list.dispatchEvent(new Event('scroll'));
  }
};

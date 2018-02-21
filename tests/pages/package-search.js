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

    get providerName() {
      return $scope.find('[data-test-eholdings-package-list-item-provider-name]').text();
    },

    get numTitles() {
      return parseInt($scope.find('[data-test-eholdings-package-list-item-num-titles]').text(), 10);
    },

    get numTitlesSelected() {
      return parseInt($scope.find('[data-test-eholdings-package-list-item-num-titles-selected]').text(), 10);
    },

    get isSelected() {
      return $scope.find('[data-test-eholdings-package-list-item-selected]').text().toLowerCase() === 'selected';
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
  get $titleSearchField() {
    return $('[data-test-title-search-field]').find('input[name="search"]');
  },
  get $searchResultsItems() {
    return $('[data-test-query-list="packages"] li a');
  },

  get totalResults() {
    return $('[data-test-eholdings-search-results-header] p').text();
  },

  get hasErrors() {
    return $('[data-test-query-list-error="packages"]').length > 0;
  },

  get noResultsMessage() {
    return $('[data-test-query-list-not-found="packages"]').text();
  },

  get previewPaneIsVisible() {
    return $('[data-test-preview-pane="packages"]').length === 1;
  },

  get packageList() {
    return this.$searchResultsItems.toArray().map(createPackageObject);
  },

  get $backButton() {
    return $('[data-test-eholdings-package-details-back-button] button');
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

  clickTitle(index) {
    let $title = null;

    // wait until the item exists before clicking
    return convergeOn(() => {
      $title = $('[data-test-query-list="package-titles"] li a');
      expect($title.eq(index)).to.exist;
    }).then(() => $title.get(index).click());
  },

  clickBackButton() {
    return $('[data-test-eholdings-customer-resource-show-back-button] button').trigger('click');
  },

  scrollToOffset(readOffset) {
    let $list = $('[data-test-query-list="packages"]').get(0);
    let rowHeight = $('li', $list).get(0).offsetHeight;
    let scrollOffset = rowHeight * readOffset;

    $list.scrollTop = scrollOffset;
    $list.dispatchEvent(new Event('scroll'));
  }
};

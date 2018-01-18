import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '../it-will';
import { triggerChange } from '../helpers';

function createTitleObject(element) {
  let $scope = $(element);

  return {
    get name() {
      return $scope.find('[data-test-eholdings-title-list-item-title-name]').text();
    },

    get publisherName() {
      return $scope.find('[data-test-eholdings-title-list-item-publisher-name]').text();
    },

    get publicationType() {
      return $scope.find('[data-test-eholdings-title-list-item-publication-type]').text();
    },

    get isSelected() {
      return $scope.find('[data-test-eholdings-title-list-item-title-selected]').text() === 'Selected';
    },

    get isHidden() {
      return $scope.find('[data-test-eholdings-title-list-item-title-hidden]').text() === 'Hidden';
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
    return $('[data-test-query-list="titles"] li a');
  },

  get totalResults() {
    return $('[data-test-eholdings-search-results-header] p').text();
  },

  get hasErrors() {
    return $('[data-test-query-list-error="titles"]').length > 0;
  },

  get noResultsMessage() {
    return $('[data-test-query-list-not-found="titles"]').text();
  },

  get previewPaneIsVisible() {
    return $('[data-test-preview-pane="titles"]').length === 1;
  },

  get titleList() {
    return this.$searchResultsItems.toArray().map(createTitleObject);
  },

  get $backButton() {
    return $('[data-test-eholdings-title-show-back-button] button');
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
      $pkg = $('[data-test-query-list="title-packages"] li a');
      expect($pkg.eq(index)).to.exist;
    }).then(() => $pkg.get(index).click());
  },

  clickBackButton() {
    return $('[data-test-eholdings-customer-resource-show-back-button] button').trigger('click');
  },

  scrollToOffset(readOffset) {
    let $list = $('[data-test-query-list="titles"]').get(0);
    let rowHeight = $('li', $list).get(0).offsetHeight;
    let scrollOffset = rowHeight * readOffset;

    $list.scrollTop = scrollOffset;
    $list.dispatchEvent(new Event('scroll'));
  }
};

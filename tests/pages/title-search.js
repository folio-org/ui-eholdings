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
    return $('[data-test-title-search-results-list] li a');
  },

  get hasErrors() {
    return $('[data-test-title-search-error-message]').length > 0;
  },

  get noResultsMessage() {
    return $('[data-test-title-search-no-results]').text();
  },

  get previewPaneIsVisible() {
    return $('[data-test-preview-pane="titles"]').length === 1;
  },

  get titleList() {
    return $('[data-test-title-search-results-list] li').toArray().map(createTitleObject);
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
    return $('[data-test-eholdings-customer-resource-show-back-button]').trigger('click');
  }
};

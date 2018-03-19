import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '@bigtest/convergence';
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
    return $('[data-test-title-search-field]').find('input[name="search"]');
  },
  get $providerSearchField() {
    return $('[data-test-search-field]');
  },
  get $searchFilters() {
    return $('[data-test-eholdings-search-filters="titles"]');
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
    return $('[data-test-eholdings-details-view-back-button] button');
  },

  get $selectedSearchType() {
    return $('[data-test-search-form-type-switcher] a[class^="is-active--"]');
  },

  clickSearchVignette() {
    return $('[data-test-search-vignette]').trigger('click');
  },
  search(query) {
    let $input = $('[data-test-title-search-field]').find('input[name="search"]').val(query);
    triggerChange($input.get(0));

    return convergeOn(() => {
      expect($input).to.have.value(query);
    }).then(() => {
      $('[data-test-search-submit]').trigger('click');
    });
  },
  get $searchFieldSelect() {
    return $('[data-test-title-search-field]').find('select')[0];
  },
  selectSearchField(searchfield) {
    let $input = $('[data-test-title-search-field]').find('select').val(searchfield);
    return triggerChange($input.get(0));
  },

  getFilter(name) {
    return this.$searchFilters.find(`input[name="${name}"]:checked`).val();
  },

  clickFilter(name, value) {
    let $radio = this.$searchFilters.find(`input[name="${name}"][value="${value}"]`);
    $radio.get(0).click();
    return convergeOn(() => expect($radio).to.have.prop('checked'));
  },

  clearFilter(name) {
    this.$searchFilters.find(`input[name="${name}"]`)
      .closest('section').find('[role="heading"] button:nth-child(2)')
      .get(0)
      .click();
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
    return $('[data-test-eholdings-details-view-back-button] button').trigger('click');
  },

  scrollToOffset(readOffset) {
    let $list = $('[data-test-query-list="titles"]').get(0);
    let rowHeight = $('li', $list).get(0).offsetHeight;
    let scrollOffset = rowHeight * readOffset;

    $list.scrollTop = scrollOffset;
    $list.dispatchEvent(new Event('scroll'));
  }
};

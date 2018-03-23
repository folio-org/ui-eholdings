import $ from 'jquery';

function createTitleObject(element) {
  let $scope = $(element);

  return {
    get isSelected() {
      return $scope.find('[data-test-eholdings-title-list-item-title-selected]').text() === 'Selected';
    }
  };
}

export default {
  get $root() {
    return $('[data-test-eholdings-details-view="package"]');
  },

  get $detailPaneContents() {
    return $('[data-test-eholdings-detail-pane-contents]');
  },

  get $titleContainer() {
    return $('[data-test-eholdings-details-view-list="package"]');
  },

  get $titleQueryList() {
    return $('[data-test-query-list="package-titles"]');
  },

  get titleList() {
    return $('[data-test-query-list="package-titles"] li a').toArray().map(createTitleObject);
  },

  scrollToTitleOffset(readOffset) {
    let $list = $('[data-test-query-list="package-titles"]').get(0);
    let rowHeight = $('li', $list).get(0).offsetHeight;
    let scrollOffset = rowHeight * readOffset;

    $list.scrollTop = scrollOffset;
    $list.dispatchEvent(new Event('scroll'));
  }
};

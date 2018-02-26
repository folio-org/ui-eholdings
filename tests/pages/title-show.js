import $ from 'jquery';

function createPackageObject(element) {
  let $scope = $(element);

  return {
    get name() {
      return $scope.find('[data-test-eholdings-package-list-item-name]').text();
    },

    get isSelected() {
      return $scope.find('[data-test-eholdings-package-list-item-selected]').text() === 'Selected';
    }
  };
}

export default {
  get $root() {
    return $('[data-test-eholdings-details-view="title"]');
  },

  get $detailPaneContents() {
    return $('[data-test-eholdings-detail-pane-contents]');
  },

  get titleName() {
    return $('[data-test-eholdings-details-view-name="title"]').text();
  },

  get publisherName() {
    return $('[data-test-eholdings-title-show-publisher-name]').text();
  },

  get publicationType() {
    return $('[data-test-eholdings-title-show-publication-type]').text();
  },

  get identifiersList() {
    return $('[data-test-eholdings-identifiers-list-item]').toArray().map(item => $(item).text());
  },

  get contributorsList() {
    return $('[data-test-eholdings-contributors-list-item]').toArray().map(item => $(item).text());
  },

  get subjectsList() {
    return $('[data-test-eholdings-title-show-subjects-list]').text();
  },

  get hasErrors() {
    return $('[data-test-eholdings-details-view-error="title"]').length > 0;
  },

  get $packageContainer() {
    return $('[data-test-eholdings-details-view-list="title"]');
  },

  get packageList() {
    return $('[data-test-query-list="title-packages"] li a').toArray().map(createPackageObject);
  },

  get $backButton() {
    return $('[data-test-eholdings-title-show-back-button] button');
  },

  scrollToPackageOffset(readOffset) {
    let $list = $('[data-test-query-list="title-packages"]').get(0);
    let rowHeight = $('li', $list).get(0).offsetHeight;
    let scrollOffset = rowHeight * readOffset;

    $list.scrollTop = scrollOffset;
    $list.dispatchEvent(new Event('scroll'));
  }
};

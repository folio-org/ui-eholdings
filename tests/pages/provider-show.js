import $ from 'jquery';

function createPackageObject(element) {
  let $scope = $(element);

  return {
    get name() {
      return $scope.find('[data-test-eholdings-package-list-item-name]').text();
    },

    get numTitles() {
      return parseInt($scope.find('[data-test-eholdings-package-list-item-num-titles]').text(), 10);
    },

    get numTitlesSelected() {
      return parseInt($scope.find('[data-test-eholdings-package-list-item-num-titles-selected]').text(), 10);
    },

    get isHidden() {
      return $scope.find('[data-test-eholdings-package-list-item-title-hidden]').text() === 'Hidden';
    }
  };
}

export default {
  get $root() {
    return $('[data-test-eholdings-details-view="provider"]');
  },

  get name() {
    return $('[data-test-eholdings-details-view-name="provider"]').text();
  },

  get hasErrors() {
    return $('[data-test-eholdings-details-view-error="provider"]').length > 0;
  },

  get errorMessage() {
    return $('[data-test-eholdings-details-view-error="provider"]').text();
  },

  get numPackages() {
    return $('[data-test-eholdings-provider-details-packages-total]').text();
  },

  get numPackagesSelected() {
    return $('[data-test-eholdings-provider-details-packages-selected]').text();
  },

  get packageList() {
    return $('[data-test-query-list="provider-packages"] li a').toArray().map(createPackageObject);
  },

  get $backButton() {
    return $('[data-test-eholdings-details-view-back-button] button');
  },

  get paneTitle() {
    return $('[data-test-eholdings-details-view-pane-title]').text();
  },

  scrollToPackageOffset(readOffset) {
    let $list = $('[data-test-query-list="provider-packages"]').get(0);
    let rowHeight = $('li', $list).get(0).offsetHeight;
    let scrollOffset = rowHeight * readOffset;

    $list.scrollTop = scrollOffset;
    $list.dispatchEvent(new Event('scroll'));
  }
};

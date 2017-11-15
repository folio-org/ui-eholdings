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
    }
  };
}

export default {
  get $root() {
    return $('[data-test-eholdings-vendor-details]');
  },

  get name() {
    return $('[data-test-eholdings-vendor-details-name]').text();
  },

  get hasErrors() {
    return $('[data-test-eholdings-vendor-details-error]').length > 0;
  },

  get errorMessage() {
    return $('[data-test-eholdings-vendor-details-error]').text();
  },

  get numPackages() {
    return $('[data-test-eholdings-vendor-details-packages-total]').text();
  },

  get numPackagesSelected() {
    return $('[data-test-eholdings-vendor-details-packages-selected]').text();
  },

  get packageList() {
    return $('[data-test-eholdings-package-list-item]').toArray().map(createPackageObject);
  },

  get $backButton() {
    return $('[data-test-eholdings-vendor-details-back-button]');
  }
};

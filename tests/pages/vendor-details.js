import $ from 'jquery';

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

  get numPackages() {
    return $('[data-test-eholdings-vendor-details-packages-total]').text();
  },

  get numPackagesSelected() {
    return $('[data-test-eholdings-vendor-details-packages-selected]').text();
  },

  get packageList() {
    return $('[data-test-eholdings-vendor-package]').map(createPackageObject);
  }
};

function createPackageObject(index, element) {
  let $scope = $(element);
  
  return {
    get name() {
      return $scope.find('[data-test-eholdings-vendor-package-name]').text();
    },

    get numTitles() {
      return parseInt($scope.find('[data-test-eholdings-vendor-details-package-num-titles]').text(), 10);
    },

    get numTitlesSelected() {
      return parseInt($scope.find('[data-test-eholdings-vendor-details-package-num-titles-selected]').text(), 10);
    }
  };
}

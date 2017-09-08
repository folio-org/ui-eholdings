import $ from 'jquery';

export default {
  get $root() {
    return $('[data-test-eholdings-title-show]');
  },

  get titleName() {
    return $('[data-test-eholdings-title-show-title-name]').text();
  },

  get publisherName() {
    return $('[data-test-eholdings-title-show-publisher-name]').text();
  },

  get publicationType() {
    return $('[data-test-eholdings-title-show-publication-type]').text();
  },

  get identifiersList() {
    return $('[data-test-eholdings-identifiers-list-item]').toArray().map((item) => $(item).text());
  },

  get subjectsList() {
    return $('[data-test-eholdings-title-show-subjects-list]').text();
  },

  get hasErrors() {
    return $('[data-test-eholdings-title-show-error]').length > 0;
  },

  get packageList() {
    return $('[data-test-eholdings-title-show-package-list] li').toArray().map(createPackageObject);
  }
};

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

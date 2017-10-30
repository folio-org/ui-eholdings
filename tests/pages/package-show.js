import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '../it-will';

function createTitleObject(element) {
  let $scope = $(element);

  return {
    get name() {
      return $scope.find('[data-test-eholdings-title-list-item-title-name]').text();
    },

    get isSelected() {
      return $scope.find('[data-test-eholdings-title-list-item-title-selected]').text() === 'Selected';
    }
  };
}

export default {
  get $root() {
    return $('[data-test-eholdings-package-details]');
  },

  get name() {
    return $('[data-test-eholdings-package-details-name]').text();
  },

  get vendor() {
    return $('[data-test-eholdings-package-details-vendor]').text();
  },

  get contentType() {
    return $('[data-test-eholdings-package-details-content-type]').text();
  },

  get numTitles() {
    return $('[data-test-eholdings-package-details-titles-total').text();
  },

  get numTitlesSelected() {
    return $('[data-test-eholdings-package-details-titles-selected').text();
  },

  get isSelected() {
    return $('[data-test-eholdings-package-details-selected]').text() === 'Selected';
  },

  toggleIsSelected() {
    /*
     * We don't want to click the element before it exists.  This should
     * probably become a generic 'click' helper once we have more usage.
     */
    return convergeOn(() => {
      expect($('[data-test-eholdings-package-details-selected]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-package-details-selected] input').click()
    ));
  },

  get isSelecting() {
    return $('[data-test-eholdings-package-details-selected] [data-test-toggle-switch]').attr('class').indexOf('is-pending--') !== -1;
  },

  get isSelectedToggleable() {
    return $('[data-test-eholdings-package-details-selected] input[type=checkbox]').prop('disabled') === false;
  },

  get allTitlesSelected() {
    return this.titleList.every(title => title.isSelected);
  },

  get hasErrors() {
    return $('[data-test-eholdings-package-details-error]').length > 0;
  },

  get titleList() {
    return $('[data-test-eholdings-package-details-title-list] li').toArray().map(createTitleObject);
  },

  get isHidden() {
    return $('[data-test-eholdings-package-details-is-hidden]').length === 1;
  },

  get customCoverage() {
    return $('[data-test-eholdings-package-details-custom-coverage]').text();
  }
};

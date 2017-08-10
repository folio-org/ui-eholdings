import $ from 'jquery';

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
    return $('[data-test-eholdings-package-details-selected]').text();
  },
  get hasErrors() {
    return $('[data-test-eholdings-package-details-error]').length > 0;
  }
};

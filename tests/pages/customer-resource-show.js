import $ from 'jquery';

export default {
  get $root() {
    return $('[data-test-eholdings-customer-resource-show]');
  },

  get titleName() {
    return $('[data-test-eholdings-customer-resource-show-title-name]').text();
  },

  get vendorName() {
    return $('[data-test-eholdings-customer-resource-show-vendor-name]').text();
  },

  get packageName() {
    return $('[data-test-eholdings-customer-resource-show-package-name]').text();
  },

  get hasErrors() {
    return $('[data-test-eholdings-customer-resource-show-error]').length > 0;
  },

  get isSelected() {
    return $('[data-test-eholdings-customer-resource-show-selected]').text();
  }
};

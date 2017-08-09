import $ from 'jquery';
import { triggerChange } from '../helpers';

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
  }
};

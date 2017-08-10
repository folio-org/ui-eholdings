import $ from 'jquery';
import { triggerChange } from '../helpers';

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
    return parseInt($('[data-test-eholdings-package-details-titles-total').text(), 10);
  },
  get numTitlesSelected() {
    return parseInt($('[data-test-eholdings-package-details-titles-selected').text(), 10);
  },
  get isSelected() {
    return $('[data-test-eholdings-package-details-selected]').value();
  },
  get hasErrors() {
    return $('[data-test-eholdings-package-details-error]').length > 0;
  }
};

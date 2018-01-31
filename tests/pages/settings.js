import $ from 'jquery';
import { fillIn, blur } from './helpers';

export default {
  get $root() {
    return $('[data-test-eholdings-settings]');
  },
  get $customerIdField() {
    return $('[data-test-eholdings-settings-customerid] input');
  },
  get $apiKeyField() {
    return $('[data-test-eholdings-settings-apikey] input');
  },
  get $actions() {
    return $('[data-test-eholdings-settings-actions]');
  },
  get $saveButton() {
    return this.$actions.find('[type="submit"]');
  },
  get $cancelButton() {
    return this.$actions.find('[type="reset"]');
  },

  get description() {
    return $('[data-test-eholdings-settings-description]').text();
  },

  get hasErrors() {
    return $('[data-test-eholdings-settings-error]').length > 0;
  },

  get customerIdFieldIsInvalid() {
    return $('[data-test-eholdings-settings-customerid]').get(0).className.includes('has-error--');
  },

  get apiKeyFieldIsInvalid() {
    return $('[data-test-eholdings-settings-apikey]').get(0).className.includes('has-error--');
  },

  get errorText() {
    return $('[data-test-eholdings-settings-error]').text();
  },

  fillIn({ customerId, apiKey }) {
    return Promise.all([
      fillIn(this.$customerIdField, customerId),
      fillIn(this.$apiKeyField, apiKey)
    ]);
  },

  blurCustomerId() {
    blur(this.$customerIdField);
  },

  blurApiKey() {
    blur(this.$apiKeyField);
  },

  save() {
    this.$saveButton.click();
  },

  cancel() {
    this.$cancelButton.click();
  }
};

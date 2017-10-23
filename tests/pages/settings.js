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
    return $('[data-test-eholdings-settings-customerid] label').css('color') === 'rgb(153, 0, 0)' &&
      $('[data-test-eholdings-settings-customerid] input').css('border-color') === 'rgb(153, 0, 0)';
  },

  get apiKeyFieldIsInvalid() {
    return $('[data-test-eholdings-settings-apikey] label').css('color') === 'rgb(153, 0, 0)' &&
      $('[data-test-eholdings-settings-apikey] input').css('border-color') === 'rgb(153, 0, 0)';
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

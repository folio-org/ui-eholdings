import {
  attribute,
  blurrable,
  clickable,
  fillable,
  isPresent,
  page,
  property,
  text,
  value
} from '@bigtest/interaction';

import { hasClassBeginningWith } from './helpers';

@page class SettingsPage {
  customerId = value('[data-test-eholdings-settings-customerid] input');
  apiKey = value('[data-test-eholdings-settings-apikey] input');
  fillCustomerId = fillable('[data-test-eholdings-settings-customerid] input');
  fillApiKey = fillable('[data-test-eholdings-settings-apikey] input');
  blurCustomerId = blurrable('[data-test-eholdings-settings-customerid] input');
  blurApiKey = blurrable('[data-test-eholdings-settings-apikey] input');
  hasVisibleActions = isPresent('[data-test-eholdings-settings-actions]');
  customerIdFieldIsInvalid = hasClassBeginningWith('has-error--', '[data-test-eholdings-settings-customerid]');
  apiKeyFieldIsInvalid = hasClassBeginningWith('has-error--', '[data-test-eholdings-settings-apikey]');
  errorText = text('[data-test-eholdings-settings-error]');
  description = text('[data-test-eholdings-settings-description]');
  save = clickable('[data-test-eholdings-settings-actions] [type="submit"]');
  saveButtonDisabled = property('disabled', '[data-test-eholdings-settings-actions] [type="submit"]');
  cancel = clickable('[data-test-eholdings-settings-actions] [type="reset"]');
  apiKeyInputType = attribute('type', '[data-test-eholdings-settings-apikey] input');
}

export default new SettingsPage('[data-test-eholdings-settings]');

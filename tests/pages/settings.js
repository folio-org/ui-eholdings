import {
  attribute,
  blurrable,
  clickable,
  fillable,
  isPresent,
  page,
  property,
  value
} from '@bigtest/interaction';
import Toast from './toast';

import { hasClassBeginningWith } from './helpers';

@page class SettingsPage {
  customerId = value('[data-test-eholdings-settings-customerid] input');
  apiKey = value('[data-test-eholdings-settings-apikey] input');
  fillCustomerId = fillable('[data-test-eholdings-settings-customerid] input');
  fillApiKey = fillable('[data-test-eholdings-settings-apikey] input');
  blurCustomerId = blurrable('[data-test-eholdings-settings-customerid] input');
  blurApiKey = blurrable('[data-test-eholdings-settings-apikey] input');
  hasVisibleActions = isPresent('[data-test-eholdings-settings-kb-actions]');
  customerIdFieldIsInvalid = hasClassBeginningWith('feedbackError--', '[data-test-eholdings-settings-customerid] input');
  apiKeyFieldIsInvalid = hasClassBeginningWith('feedbackError--', '[data-test-eholdings-settings-apikey] input');
  save = clickable('[data-test-eholdings-settings-kb-actions] [type="submit"]');
  saveButtonDisabled = property('disabled', '[data-test-eholdings-settings-kb-actions] [type="submit"]');
  cancel = clickable('[data-test-eholdings-settings-kb-actions] [type="reset"]');
  apiKeyInputType = attribute('type', '[data-test-eholdings-settings-apikey] input');

  toast = Toast;
}

export default new SettingsPage('[data-test-eholdings-settings]');

import {
  attribute,
  blurrable,
  clickable,
  fillable,
  isPresent,
  interactor,
  property,
  value
} from '@bigtest/interactor';
import Toast from './toast';

import { hasClassBeginningWith } from './helpers';

@interactor class SettingsPage {
  customerId = value('[data-test-eholdings-settings-customerid] input');
  apiKey = value('[data-test-eholdings-settings-apikey] input');
  fillCustomerId = fillable('[data-test-eholdings-settings-customerid] input');
  fillApiKey = fillable('[data-test-eholdings-settings-apikey] input');
  blurCustomerId = blurrable('[data-test-eholdings-settings-customerid] input');
  blurApiKey = blurrable('[data-test-eholdings-settings-apikey] input');
  hasVisibleActions = isPresent('[data-test-eholdings-settings-kb-actions]');
  customerIdFieldIsInvalid = hasClassBeginningWith('[data-test-eholdings-settings-customerid] input', 'hasError--');
  apiKeyFieldIsInvalid = hasClassBeginningWith('[data-test-eholdings-settings-apikey] input', 'hasError--');
  save = clickable('[data-test-eholdings-settings-kb-actions] [type="submit"]');
  saveButtonDisabled = property('[data-test-eholdings-settings-kb-actions] [type="submit"]', 'disabled');
  cancel = clickable('[data-test-eholdings-settings-kb-actions] [type="reset"]');
  apiKeyInputType = attribute('[data-test-eholdings-settings-apikey] input', 'type');

  toast = Toast;
}

export default new SettingsPage('[data-test-eholdings-settings]');

import {
  attribute,
  blurrable,
  clickable,
  fillable,
  interactor,
  property,
  value,
  isPresent
} from '@bigtest/interactor';

import Toast from './toast';
import { hasClassBeginningWith } from './helpers';

@interactor class SettingsPage {
  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  isLoaded = isPresent('[data-test-eholdings-settings-customerid]');
  customerId = value('[data-test-eholdings-settings-customerid] input');
  apiKey = value('[data-test-eholdings-settings-apikey] input');
  rmapiBaseUrl = value('[data-test-eholdings-settings-kb-url] select');
  chooseRMAPIUrl = fillable('[data-test-eholdings-settings-kb-url] select');
  fillCustomerId = fillable('[data-test-eholdings-settings-customerid] input');
  fillApiKey = fillable('[data-test-eholdings-settings-apikey] input');
  blurCustomerId = blurrable('[data-test-eholdings-settings-customerid] input');
  blurApiKey = blurrable('[data-test-eholdings-settings-apikey] input');
  customerIdFieldIsInvalid = hasClassBeginningWith('[data-test-eholdings-settings-customerid] [class*=inputGroup--]', 'hasError--');
  apiKeyFieldIsInvalid = hasClassBeginningWith('[data-test-eholdings-settings-apikey] [class*=inputGroup--]', 'hasError--');
  save = clickable('[data-test-eholdings-settings-kb-save-button]');
  cancel = clickable('[data-test-eholdings-settings-kb-cancel-button]');
  saveButtonDisabled = property('[data-test-eholdings-settings-kb-save-button]', 'disabled');
  apiKeyInputType = attribute('[data-test-eholdings-settings-apikey] input', 'type');

  toast = Toast;
}

export default new SettingsPage('[data-test-eholdings-settings]');

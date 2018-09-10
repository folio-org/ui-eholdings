import {
  action,
  attribute,
  blurrable,
  clickable,
  fillable,
  interactor,
  property,
  value
} from '@bigtest/interactor';
import Toast from './toast';

import { hasClassBeginningWith } from './helpers';

@interactor class SettingsKBDropDown {
  clickDropDownButton = clickable('button');
}

@interactor class SettingsKBDropDownMenu {
  clickCancel = clickable('.tether-element [data-test-eholdings-settings-kb-cancel-action]');
}

@interactor class SettingsPage {
  customerId = value('[data-test-eholdings-settings-customerid] input');
  apiKey = value('[data-test-eholdings-settings-apikey] input');
  fillCustomerId = fillable('[data-test-eholdings-settings-customerid] input');
  fillApiKey = fillable('[data-test-eholdings-settings-apikey] input');
  blurCustomerId = blurrable('[data-test-eholdings-settings-customerid] input');
  blurApiKey = blurrable('[data-test-eholdings-settings-apikey] input');
  customerIdFieldIsInvalid = hasClassBeginningWith('[data-test-eholdings-settings-customerid] input', 'hasError--');
  apiKeyFieldIsInvalid = hasClassBeginningWith('[data-test-eholdings-settings-apikey] input', 'hasError--');
  save = clickable('[data-test-eholdings-settings-kb-save-button]');
  saveButtonDisabled = property('[data-test-eholdings-settings-kb-save-button]', 'disabled');
  apiKeyInputType = attribute('[data-test-eholdings-settings-apikey] input', 'type');

  toast = Toast;

  dropDown = new SettingsKBDropDown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  dropDownMenu = new SettingsKBDropDownMenu();
  clickCancel= action(function () {
    return this
      .dropDown.clickDropDownButton()
      .dropDownMenu.clickCancel();
  });
}

export default new SettingsPage('[data-test-eholdings-settings]');

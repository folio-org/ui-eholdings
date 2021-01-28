import {
  attribute,
  blurrable,
  clickable,
  fillable,
  interactor,
  property,
  value,
  isPresent,
  scoped,
  text,
} from '@bigtest/interactor';

import Toast from './toast';
import ShowHidePasswordField from '../interactors/show-hide-password-field';
import { hasClassBeginningWith } from './helpers';

@interactor class DeleteConfirmationModal {
  confirmKBDelete = clickable('[data-test-confirm-delete-kb-credentials]');
  cancelKBDelete = clickable('[data-test-cancel-delete-kb-credentials]');
}

@interactor class DeleteSuccessNotification {
  confirmKBDelete = clickable('[data-test-confirm-delete-kb-credentials]');
  cancelKBDelete = clickable('[data-test-cancel-delete-kb-credentials]');
}

@interactor class SettingsPage {
  isLoaded = isPresent('[data-test-eholdings-settings-customerid]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

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
  save = clickable('[data-test-eholdings-settings-form-save-button]');
  cancel = clickable('[data-test-eholdings-settings-form-cancel-button]');
  saveButtonDisabled = property('[data-test-eholdings-settings-form-save-button]', 'disabled');
  apiKeyInputType = attribute('[data-test-eholdings-settings-apikey] input', 'type');
  nameFieldIsPresent = isPresent('[data-test-eholdings-settings-kb-name]');
  nameField = scoped('[data-test-eholdings-settings-kb-name]', {
    value: value('input'),
    validationMessage: text('[class^="feedbackError---"]'),
    blur: blurrable('input'),
    fill: fillable('input'),

    fillAndBlur(name) {
      return this.fill(name).blur();
    }
  });

  apiKeyField = new ShowHidePasswordField('[class^="showHidePasswordField--"]');
  deleteButtonIsDisplayed = isPresent('[data-test-delete-kb-credentials]');
  clickDeleteButton = clickable('[data-test-delete-kb-credentials]');
  deleteNotification = new DeleteSuccessNotification('[data-test-kb-deleted-notification]');
  deleteConfirmationModal = new DeleteConfirmationModal('#delete-kb-confirmation-modal');

  toast = Toast;

  whenApiKeyLoaded() {
    return this.when(() => this.apiKeyField.isShowHideButtonPresent);
  }
}

export default new SettingsPage('[data-test-eholdings-settings-kb]');

import {
  collection,
  clickable,
  interactor,
  property,
} from '@bigtest/interactor';

import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import ModalInteractor from '@folio/stripes-components/lib/Modal/tests/interactor';

import Toast from './toast';
import SettingsCustomLabelField from './settings-custom-label-field';

@interactor class SettingsCustomLabelsPage {
  customLabels = collection('[data-test-settings-custom-label]', SettingsCustomLabelField);
  save = clickable('[data-test-eholdings-settings-form-save-button]');
  cancel = clickable('[data-test-eholdings-settings-form-cancel-button]');
  saveButtonDisabled = property('[data-test-eholdings-settings-form-save-button]', 'disabled');
  removeConfirmationModal = new ConfirmationModalInteractor('#confirmation-modal');
  navigationModal = new ModalInteractor('#navigation-modal');
  navigationModalContinueButton = clickable('[data-test-navigation-modal-continue]');
  navigationModalDismissButton = clickable('[data-test-navigation-modal-dismiss]');
  closeButton = clickable('[class*="paneCloseLinkX---"]');
  toast = Toast;
}

export default new SettingsCustomLabelsPage('[data-test-eholdings-settings-custom-labels]');

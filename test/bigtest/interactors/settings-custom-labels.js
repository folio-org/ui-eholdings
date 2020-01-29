import {
  blurrable,
  collection,
  clickable,
  isPresent,
  interactor,
  fillable,
  property,
  value,
} from '@bigtest/interactor';

import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import ModalInteractor from '@folio/stripes-components/lib/Modal/tests/interactor';

import Toast from './toast';

@interactor class CustomLabelField {
  label = value('[class^="textField---"] input');
  blurLabel = blurrable('[class^="textField---"] input');
  fillLabel = fillable('[class^="textField---"] input');
  showOnPublicationFinderValue = value('[name$="displayOnPublicationFinder"]');
  showOnFullTextFinderValue = value('[name$="displayOnFullTextFinder"]');
  validationMessageIsPresent = isPresent('[class^="feedbackError---"]');

  fillAndBlurLabel(label) {
    return this
      .fillLabel(label)
      .blurLabel();
  }
}

@interactor class SettingsCustomLabelsPage {
  customLabels = collection('[data-test-settings-custom-label]', CustomLabelField);
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

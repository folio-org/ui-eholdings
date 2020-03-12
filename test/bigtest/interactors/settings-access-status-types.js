import {
  interactor,
  clickable,
  collection,
  text,
  property,
  isPresent,
} from '@bigtest/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';


@interactor class SettingsAccessStatusTypesPage {
  clickAddNewButton = clickable('[id^="clickable-add-"]');
  addNewButtonIsDisabled = property('[id^="clickable-add-"]', 'disabled');
  confirmationModalIsPresent = isPresent('#delete-access-status-type-confirmation-modal');
  cancelStatusTypeDeleteButton = clickable('[data-test-confirmation-modal-cancel-button]');
  confirmStatusTypeDeleteButton = clickable('[data-test-confirmation-modal-confirm-button]');
  successText = text('[data-test-eholdings-toast="success"]');

  accessStatusTypesList = collection('[id^="editList-"] [data-row-index]', {
    clickDelete: clickable('[id^="clickable-delete-"]'),
    clickEdit: clickable('[id^="clickable-edit-"]'),
    clickSave: clickable('[id^="clickable-save-"]'),
    nameField: new TextFieldInteractor('[data-test-settings-access-type-name-field]'),
    descriptionField: new TextFieldInteractor('[data-test-settings-access-type-description-field]'),
    validationErrorMessage: text('[class^="feedbackError---"]'),
    cols: collection('[class^="mclCell---"]', {
      context: text(),
    }),
  });
}

export default new SettingsAccessStatusTypesPage(['data-test-settings-access-status-types']);

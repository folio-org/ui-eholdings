import {
  interactor,
  clickable,
  text,
} from '@bigtest/interactor';

export default @interactor class DeleteConfirmationModal {
  clickCancelButton = clickable('[data-test-confirmation-modal-cancel-button]');
  clickConfirmButton = clickable('[data-test-confirmation-modal-confirm-button]');
  message = text('[data-test-delete-confirmation-message]');
}

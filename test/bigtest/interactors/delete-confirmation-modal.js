import {
  clickable,
  text,
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

export default @interactor class DeleteConfirmationModal {
  clickCancelButton = clickable('[data-test-confirmation-modal-cancel-button]');
  clickConfirmButton = clickable('[data-test-confirmation-modal-confirm-button]');
  message = text('[data-test-delete-confirmation-message]');
}

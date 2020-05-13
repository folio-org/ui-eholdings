import {
  interactor,
  isPresent,
  clickable,
  text,
  property,
} from '@bigtest/interactor';

export default @interactor class ResourceEditModal {
  hasDeselectTitleWarning = isPresent('[data-test-eholdings-deselect-title-warning]');
  hasDeselectFinalTitleWarning = isPresent('[data-test-eholdings-deselect-final-title-warning]');
  confirmDeselection = clickable('[data-test-eholdings-resource-deselection-confirmation-modal-yes]');
  cancelDeselection = clickable('[data-test-eholdings-resource-deselection-confirmation-modal-no]');
  confirmButtonText = text('[data-test-eholdings-resource-deselection-confirmation-modal-yes]');
  confirmButtonIsDisabled = property('[data-test-eholdings-resource-deselection-confirmation-modal-yes]', 'disabled');
}

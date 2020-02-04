import {
  interactor,
  clickable,
  text,
  property,
} from '@bigtest/interactor';

export default @interactor class PackageModal {
  cancelDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-no]');
  confirmDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-yes]');
  confirmButtonText = text('[data-test-eholdings-package-deselection-confirmation-modal-yes]');
  confirmButtonIsDisabled = property('[data-test-eholdings-package-deselection-confirmation-modal-yes]', 'disabled');
}

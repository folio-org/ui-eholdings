import {
  interactor,
  clickable,
} from '@bigtest/interactor';

export default @interactor class PackageSelectionModal {
  confirmPackageSelection = clickable('[data-test-confirm-package-selection]');
  cancelPackageSelection = clickable('[data-test-cancel-package-selection]');
}

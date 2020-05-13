import {
  clickable,
  collection,
  property,
  interactor,
  fillable,
} from '@bigtest/interactor';

import { hasClassBeginningWith } from './helpers';

export default @interactor class AddToCustomPackageModal {
  hasPackageError = hasClassBeginningWith(
    '[data-test-eholdings-package-select-field] select',
    'hasError--'
  );

  choosePackage = fillable('[data-test-eholdings-package-select-field] select');
  packages = collection('[data-test-eholdings-package-select-field] option', {
    isDisabled: property('disabled')
  });

  fillUrl = fillable('[data-test-eholdings-custom-url-textfield] input');

  submit = clickable('[data-test-eholdings-custom-package-modal-submit]');
  cancel = clickable('[data-test-eholdings-custom-package-modal-cancel]');

  isSubmitDisabled = property('[data-test-eholdings-custom-package-modal-submit]', 'disabled');
  isCancelDisabled = property('[data-test-eholdings-custom-package-modal-cancel]', 'disabled');
}

import {
  clickable,
  collection,
  property,
  interactor,
  fillable, isPresent,
} from '@bigtest/interactor';

import SelectionInteractor from '@folio/stripes-components/lib/Selection/tests/interactor';

export default @interactor class AddToCustomPackageModal {
  hasPackageError = isPresent('[data-test-eholdings-package-select-field] [class^="feedbackError--"]');

  choosePackage = fillable('[data-test-eholdings-package-select-field] select');
  packages = collection('[data-test-eholdings-package-select-field] option', {
    isDisabled: property('disabled')
  });

  fillUrl = fillable('[data-test-eholdings-custom-url-textfield] input');

  submit = clickable('[data-test-eholdings-custom-package-modal-submit]');
  cancel = clickable('[data-test-eholdings-custom-package-modal-cancel]');

  isSubmitDisabled = property('[data-test-eholdings-custom-package-modal-submit]', 'disabled');
  isCancelDisabled = property('[data-test-eholdings-custom-package-modal-cancel]', 'disabled');
  packageSelection = new SelectionInteractor('[data-test-eholdings-package-select-field]');
}

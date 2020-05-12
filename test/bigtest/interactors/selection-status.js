import {
  computed,
  text,
  isPresent
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

export default @interactor class PackageSelectionStatus {
  static defaultScope = '[data-test-eholdings-package-details-selected]';
  text = text('[data-test-eholdings-package-details-selected] div');
  buttonText = text('button');
  selectionText = text('[data-test-eholdings-package-details-selected] div');
  isSelected = computed(function () {
    return this.selectionText === 'Selected';
  });

  isSelecting = isPresent('[data-test-eholdings-package-details-selected] [class*=icon---] [class*=icon-spinner]');
  hasAddButton = isPresent('[data-test-eholdings-package-add-to-holdings-button]');
}

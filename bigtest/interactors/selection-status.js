import {
  interactor,
  computed,
  text,
  isPresent
} from '@bigtest/interactor';

export default @interactor class PackageSelectionStatus {
  static defaultScope = '[data-test-eholdings-package-details-selected]';
  text = text('[data-test-eholdings-package-details-selected] h4');
  buttonText = text('button');
  selectionText = text('[data-test-eholdings-package-details-selected] h4');
  isSelected = computed(function () {
    return this.selectionText === 'Selected';
  });

  isSelecting = isPresent('[data-test-eholdings-package-details-selected] [class*=icon---][class*=iconSpinner]');
  hasAddButton = isPresent('[data-test-eholdings-package-add-to-holdings-button]');
}

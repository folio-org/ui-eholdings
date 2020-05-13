import {
  interactor,
  Interactor,
  clickable,
} from '@bigtest/interactor';

export default @interactor class PackageDropDownMenu {
  clickEdit = clickable('[data-test-eholdings-package-edit-link]');
  addToHoldings = new Interactor('[data-test-eholdings-package-add-to-holdings-action]');
  removeFromHoldings = new Interactor('[data-test-eholdings-package-remove-from-holdings-action]');
}

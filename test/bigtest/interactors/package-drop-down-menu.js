import {
  interactor,
  Interactor
} from '@bigtest/interactor';

export default @interactor class PackageDropDownMenu {
  addToHoldings = new Interactor('[data-test-eholdings-package-add-to-holdings-action]');
  removeFromHoldings = new Interactor('[data-test-eholdings-package-remove-from-holdings-action]');
}

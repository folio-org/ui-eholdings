import {
  interactor,
  clickable,
} from '@bigtest/interactor';

export default @interactor class ResourceDropDownMenu {
  clickRemoveFromHoldings = clickable('[data-test-eholdings-remove-resource-from-holdings]');
  clickAddToHoldings = clickable('[data-test-eholdings-add-resource-to-holdings]');
}

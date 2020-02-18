import {
  interactor,
  clickable,
} from '@bigtest/interactor';

export default @interactor class ResourceDropDownMenu {
  clickEdit = clickable('[data-test-eholdings-resource-edit-link]');
  clickRemoveFromHoldings = clickable('[data-test-eholdings-remove-resource-from-holdings]');
  clickAddToHoldings = clickable('[data-test-eholdings-add-resource-to-holdings]');
}

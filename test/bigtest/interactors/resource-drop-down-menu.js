import {
  clickable,
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

export default @interactor class ResourceDropDownMenu {
  clickEdit = clickable('[data-test-eholdings-resource-edit-link]');
  clickRemoveFromHoldings = clickable('[data-test-eholdings-remove-resource-from-holdings]');
  clickAddToHoldings = clickable('[data-test-eholdings-add-resource-to-holdings]');
}

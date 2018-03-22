import {
  blurrable,
  clickable,
  fillable,
  isPresent,
  page,
  property,
  text,
  value
} from '@bigtest/interaction';

@page class CustomerResourceEditNavigationModal {}

@page class CustomerResourceEditPage {
  navigationModal = new CustomerResourceEditNavigationModal('#navigation-modal');

  customEmbargoTextFieldValue = value('[data-test-eholdings-custom-embargo-textfield] input');
  inputEmbargoValue = fillable('[data-test-eholdings-custom-embargo-textfield] input');
  customEmbargoSelectValue = value('[data-test-eholdings-custom-embargo-select] select');
  selectEmbargoUnit = fillable('[data-test-eholdings-custom-embargo-select] select');
  blurEmbargoValue = blurrable('[data-test-eholdings-custom-embargo-textfield] input');
  blurEmbargoUnit = blurrable('[data-test-eholdings-custom-embargo-select] select');
  clickCancel = clickable('[data-test-eholdings-customer-resource-cancel-button] button');
  clickSave = clickable('[data-test-eholdings-customer-resource-cancel-button] button');
  isSaveDisabled = property('disabled', '[data-test-eholdings-customer-resource-cancel-button] button');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="resource"]');
  validationErrorOnEmbargoTextField = text('[data-test-eholdings-custom-embargo-textfield] [class^="feedbackError--"]');
}

export default new CustomerResourceEditPage('[data-test-eholdings-details-view="resource"]');

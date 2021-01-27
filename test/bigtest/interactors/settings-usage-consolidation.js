import {
  clickable,
  interactor,
  property,
} from '@bigtest/interactor';

import Select from './select';
import ShowHidePasswordField from './show-hide-password-field';

@interactor class SettingsUsageConsolidationPage {
  save = clickable('[data-test-eholdings-settings-form-save-button]');
  cancel = clickable('[data-test-eholdings-settings-form-cancel-button]');

  usageConsolidationIdField = new ShowHidePasswordField('[class^="showHidePasswordField--"]');
  usageConsolidationStartMonthField = new Select('#eholdings-settings-usage-consolidation-month');
  currencyField = new Select('#eholdings-settings-usage-consolidation-currency');
  usageConsolidationPlatformTypeField = new Select('#eholdings-settings-usage-consolidation-platform-type');

  saveButtonDisabled = property('[data-test-eholdings-settings-form-save-button]', 'disabled');
}

export default new SettingsUsageConsolidationPage('[data-test-eholdings-settings-usage-consolidation]');

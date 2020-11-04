import {
  clickable,
  interactor,
  property,
  scoped,
} from '@bigtest/interactor';

import Select from './select';

@interactor class SettingsUsageConsolidationPage {
  save = clickable('[data-test-eholdings-settings-form-save-button]');
  cancel = clickable('[data-test-eholdings-settings-form-cancel-button]');

  usageConsolidationIdField = scoped('#eholdings-settings-usage-consolidation-id', {});
  usageConsolidationStartMonthField = new Select('#eholdings-settings-usage-consolidation-month');
  usageConsolidationPlatformTypeField = new Select('#eholdings-settings-usage-consolidation-platform-type');

  saveButtonDisabled = property('[data-test-eholdings-settings-form-save-button]', 'disabled');
}

export default new SettingsUsageConsolidationPage('[data-test-eholdings-settings-usage-consolidation]');

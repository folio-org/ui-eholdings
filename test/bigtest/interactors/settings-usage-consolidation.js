import {
  collection,
  clickable,
  interactor,
  property,
  scoped,
} from '@bigtest/interactor';

import FormField from './form-field';

@interactor class SettingsUsageConsolidationPage {
  save = clickable('[data-test-eholdings-settings-form-save-button]');
  cancel = clickable('[data-test-eholdings-settings-form-cancel-button]');

  usageConsolidationIdField = scoped('#eholdings-settings-usage-consolidation-id',{});

  saveButtonDisabled = property('[data-test-eholdings-settings-form-save-button]', 'disabled');
}

export default new SettingsUsageConsolidationPage('[data-test-eholdings-settings-usage-consolidation]');

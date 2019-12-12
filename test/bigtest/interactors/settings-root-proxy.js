import {
  clickable,
  selectable,
  interactor,
  property,
  value
} from '@bigtest/interactor';
import Toast from './toast';


@interactor class SettingsRootProxyPage {
  RootProxySelectValue = value('[data-test-eholdings-settings-root-proxy-select] select');
  chooseRootProxy = selectable('[data-test-eholdings-settings-root-proxy-select] select');
  save = clickable('[data-test-eholdings-settings-form-save-button]');
  cancel = clickable('[data-test-eholdings-settings-form-cancel-button]');
  saveButtonDisabled = property('[data-test-eholdings-settings-form-save-button]', 'disabled');

  toast = Toast;
}

export default new SettingsRootProxyPage('[data-test-eholdings-settings-root-proxy]');

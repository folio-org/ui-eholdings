import {
  interactor,
  fillable,
  clickable,
  value,
  isPresent
} from '@bigtest/interactor';
import Toast from './toast';

@interactor class SettingsRootProxyPage {
  RootProxySelectValue = value('[data-test-eholdings-settings-root-proxy-select] select');
  hasSaveButton = isPresent('[data-test-eholdings-root-proxy-save-button] button');
  hasCancelButton = isPresent('[data-test-eholdings-root-proxy-cancel-button] button');
  chooseRootProxy = fillable('[data-test-eholdings-settings-root-proxy-select] select');
  save = clickable('[data-test-eholdings-root-proxy-save-button] button');
  cancel = clickable('[data-test-eholdings-root-proxy-cancel-button] button');

  toast = Toast;
}

export default new SettingsRootProxyPage('[data-test-eholdings-settings-root-proxy]');

import {
  interactor,
  value
} from '@bigtest/interactor';

@interactor class SettingsRootProxyPage {
  RootProxySelectValue = value('[data-test-eholdings-settings-root-proxy-select] select');
}

export default new SettingsRootProxyPage('[data-test-eholdings-settings-root-proxy]');

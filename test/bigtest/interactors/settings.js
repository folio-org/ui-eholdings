import {
  interactor,
  isPresent,
  collection,
  clickable,
} from '@bigtest/interactor';

import { hasClassBeginningWith } from './helpers';

@interactor class NavListItem {
  isDisabled = hasClassBeginningWith(null, 'isDisabled');
}

@interactor class ConfigurationInteractor {
  settingsLinks = collection('[data-test-nav-list-item]', NavListItem);
  clickHeading = clickable('[data-test-configuration-heading]');
}

@interactor class Settings {
  static defaultScope = ('[data-test-eholdings-settings-pane]');
  isLoaded = isPresent('[data-test-eholdings-settings-pane]');

  whenLoaded() {
    return this.when(() => this.isPresent);
  }

  clickNew = clickable('[data-test-create-kb-configuration]');
  newButtonIsPresent = isPresent('[data-test-create-kb-configuration]');
  configurationNavigationList = collection('[data-test-nav-list]', ConfigurationInteractor);
}

export default new Settings();

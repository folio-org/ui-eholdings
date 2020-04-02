import {
  attribute,
  blurrable,
  clickable,
  fillable,
  interactor,
  property,
  value,
  isPresent,
  collection,
} from '@bigtest/interactor';

@interactor class Settings {
  isLoaded = isPresent('[data-test-eholdings-settings-pane]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  newButtonIsPresent = isPresent('[data-test-create-kb-configuration]');
  configurationNavigationList = collection('[data-test-nav-list]');
}

export default new Settings('[data-test-eholdings-settings-pane]');

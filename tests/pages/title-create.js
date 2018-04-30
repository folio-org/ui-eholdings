import {
  interactor,
  isPresent,
  fillable,
  clickable,
  property,
  value,
  count
} from '@bigtest/interactor';

@interactor class TitleCreatePage {
  static defaultScope = '[data-test-eholdings-title-create]';

  hasName = isPresent('[data-test-eholdings-title-name-field]');
  fillName = fillable('[data-test-eholdings-title-name-field] input');
  hasPublisher = isPresent('[data-test-eholdings-publisher-name-field]');
  fillPublisher = fillable('[data-test-eholdings-publisher-name-field] input');
  hasPublicationType = isPresent('[data-test-eholdings-publication-type-field]');
  choosePublicationType = fillable('[data-test-eholdings-publication-type-field] select');
  publicationType = value('[data-test-eholdings-publication-type-field] select');
  hasDescription = isPresent('[data-test-eholdings-description-textarea]');
  fillDescription = fillable('[data-test-eholdings-description-textarea] textarea');
  hasPackageSelect = isPresent('[data-test-eholdings-package-select-field]');
  packagesCount = count('[data-test-eholdings-package-select-field] option:not(:disabled)');
  selectPackage = fillable('[data-test-eholdings-package-select-field] select');
  hasPeerReviewed = isPresent('[data-test-eholdings-peer-reviewed-field]');
  togglePeerReviewed = clickable('[data-test-eholdings-peer-reviewed-field] input');
  isPeerReviewed = property('[data-test-eholdings-peer-reviewed-field] input', 'checked');
  save = clickable('[data-test-eholdings-title-create-save-button] button');
  cancel = clickable('[data-test-eholdings-title-create-cancel-button] button');
}

export default new TitleCreatePage();

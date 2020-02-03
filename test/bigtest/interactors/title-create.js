import {
  interactor,
  isPresent,
  fillable,
  clickable,
  property,
  selectable,
  value,
  count,
  collection,
} from '@bigtest/interactor';

@interactor class TitleCreatePage {
  static defaultScope = '[data-test-eholdings-title-create]';

  hasName = isPresent('[data-test-eholdings-title-name-field]');
  fillName = fillable('[data-test-eholdings-title-name-field] input');

  hasContributorBtn = isPresent('[data-test-eholdings-contributors-fields] [data-test-repeatable-field-add-item-button]');
  clickAddContributor = clickable('[data-test-eholdings-contributors-fields] [data-test-repeatable-field-add-item-button]');
  contributorsRowList = collection('[data-test-eholdings-contributors-fields] li', {
    type: fillable('[data-test-eholdings-contributor-type] select'),
    contributor: fillable('[data-test-eholdings-contributor-contributor] input'),
    clickRemoveRowButton: clickable('[data-test-repeatable-field-remove-item-button]')
  });

  hasEdition = isPresent('[data-test-eholdings-edition-field]');
  fillEdition = fillable('[data-test-eholdings-edition-field] input');
  hasPublisher = isPresent('[data-test-eholdings-publisher-name-field]');
  fillPublisher = fillable('[data-test-eholdings-publisher-name-field] input');
  hasPublicationType = isPresent('[data-test-eholdings-publication-type-field]');
  choosePublicationType = fillable('[data-test-eholdings-publication-type-field] select');
  publicationType = value('[data-test-eholdings-publication-type-field] select');

  hasIdentifiersBtn = isPresent('[data-test-eholdings-identifiers-fields] [data-test-repeatable-field-add-item-button]');
  addIdentifier(type, id) {
    const values = {
      'ISSN (Online)': '0',
      'ISSN (Print)': '1',
      'ISBN (Online)': '2',
      'ISBN (Print)': '3'
    };

    return this
      .click('[data-test-eholdings-identifiers-fields] [data-test-repeatable-field-add-item-button]')
      .fill('[data-test-eholdings-identifiers-fields-type] select', values[type])
      .fill('[data-test-eholdings-identifiers-fields-id] input', id);
  }

  hasDescription = isPresent('[data-test-eholdings-description-textarea]');
  fillDescription = fillable('[data-test-eholdings-description-textarea] textarea');
  hasPackageSelect = isPresent('[data-test-eholdings-package-select-field]');
  packagesCount = count('[data-test-eholdings-package-select-field] option:not(:disabled)');
  selectPackage = selectable('[data-test-eholdings-package-select-field] select');
  hasPeerReviewed = isPresent('[data-test-eholdings-peer-reviewed-field]');
  togglePeerReviewed = clickable('[data-test-eholdings-peer-reviewed-field] input');
  isPeerReviewed = property('[data-test-eholdings-peer-reviewed-field] input', 'checked');
  save = clickable('[data-test-eholdings-title-create-save-button]');
  isSaveDisabled = property('[data-test-eholdings-title-create-save-button]', 'disabled');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  clickBackButton = clickable('[data-test-eholdings-details-view-back-button]');
  cancelEditing = clickable('[data-test-eholdings-title-create-cancel-button]');
}

export default new TitleCreatePage();

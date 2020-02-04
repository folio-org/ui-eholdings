import {
  clickable,
  collection,
  fillable,
  isPresent,
  interactor,
  property,
  value,
  text
} from '@bigtest/interactor';
import { hasClassBeginningWith } from './helpers';
import Toast from './toast';
import NavigationModal from './navigation-modal';

@interactor class TitleEditPage {
  navigationModal = NavigationModal;

  clickCancelEditing = clickable('[data-test-eholdings-title-edit-cancel-button]');

  clickSave = clickable('[data-test-eholdings-title-save-button]');
  isSaveDisabled = property('[data-test-eholdings-title-save-button]', 'disabled');
  hasErrors = isPresent('[data-test-eholdings-title-edit-error]');
  isPeerReviewed = property('[data-test-eholdings-peer-reviewed-field] input[type=checkbox]', 'checked');
  checkPeerReviewed = clickable('[data-test-eholdings-peer-reviewed-field] input[type=checkbox]');

  descriptionField = value('[data-test-eholdings-description-textarea] textarea');
  fillDescription = fillable('[data-test-eholdings-description-textarea] textarea');
  descriptionError = hasClassBeginningWith('[data-test-eholdings-description-textarea] textarea', 'feedbackError--');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  clickBackButton = clickable('[data-test-eholdings-details-view-back-button]');

  contributorValue = value('[data-test-eholdings-contributor-contributor] input')
  contributorType = value('[data-test-eholdings-contributor-type] select')

  toast = Toast

  name = fillable('[data-test-eholdings-title-name-field] input');
  nameHasError = hasClassBeginningWith('[data-test-eholdings-title-name-field] [class*=inputGroup--]', 'hasError--');

  selectPublicationType = fillable('[data-test-eholdings-publication-type-field] select');
  publicationTypeValue = value('[data-test-eholdings-publication-type-field] select');
  fillEdition = fillable('[data-test-eholdings-edition-field] input');
  fillPublisher = fillable('[data-test-eholdings-publisher-name-field] input');
  editionValue = value('[data-test-eholdings-edition-field] input');
  publisherValue = value('[data-test-eholdings-publisher-name-field] input');
  publisherHasError = hasClassBeginningWith('[data-test-eholdings-publisher-name-field] [class*=inputGroup--]', 'hasError--');
  editionHasError = hasClassBeginningWith('[data-test-eholdings-edition-field] [class*=inputGroup--]', 'hasError--');
  publisherValue = value('[data-test-eholdings-publisher-name-field] input');
  publisherHasError = hasClassBeginningWith('[data-test-eholdings-publisher-name-field] [class*=inputGroup--]', 'hasError--');
  contributorHasError = hasClassBeginningWith('[data-test-eholdings-contributor-contributor] [class*=inputGroup--]', 'hasError--');
  contributorError = text('[data-test-eholdings-contributor-contributor] [class^="feedbackError--"]');

  hasContributorBtn = isPresent('[data-test-eholdings-contributors-fields] [data-test-repeatable-field-add-item-button]');
  clickAddContributor = clickable('[data-test-eholdings-contributors-fields] [data-test-repeatable-field-add-item-button]');
  contributorsRowList = collection('[data-test-eholdings-contributors-fields] li', {
    type: fillable('[data-test-eholdings-contributor-type] select'),
    contributor: fillable('[data-test-eholdings-contributor-contributor] input'),
    clickRemoveRowButton: clickable('[data-test-repeatable-field-remove-item-button]')
  });

  contributorsWillBeRemoved = text('[data-test-eholdings-contributors-fields] [data-test-repeatable-field-empty-message]');

  hasIdentifiersBtn = isPresent('[data-test-eholdings-identifiers-fields] [data-test-repeatable-field-add-item-button]');
  clickAddIdentifiersRowButton = clickable('[data-test-eholdings-identifiers-fields] [data-test-repeatable-field-add-item-button]');
  identifiersRowList = collection('[data-test-eholdings-identifiers-fields] li', {
    type: fillable('[data-test-eholdings-identifiers-fields-type] select'),
    id: fillable('[data-test-eholdings-identifiers-fields-id] input'),
    idHasError: hasClassBeginningWith('[data-test-eholdings-identifiers-fields-id] [class*=inputGroup--]', 'hasError--'),
    clickRemoveRowButton: clickable('[data-test-repeatable-field-remove-item-button]')
  });
}

export default new TitleEditPage();

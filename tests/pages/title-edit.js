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

@interactor class TitleEditNavigationModal {}

@interactor class TitleEditPage {
  navigationModal = new TitleEditNavigationModal('#navigation-modal');

  clickCancel = clickable('[data-test-eholdings-title-cancel-button] button');
  clickSave = clickable('[data-test-eholdings-title-save-button] button');
  isSaveDisabled = property('[data-test-eholdings-title-save-button] button', 'disabled');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="title"]');
  isPeerReviewed = property('[data-test-eholdings-peer-reviewed-field] input[type=checkbox]', 'checked');
  checkPeerReviewed = clickable('[data-test-eholdings-peer-reviewed-field] input[type=checkbox]');

  descriptionField = value('[data-test-eholdings-description-textarea] textarea');
  fillDescription = fillable('[data-test-eholdings-description-textarea] textarea');
  descriptionError = hasClassBeginningWith('[data-test-eholdings-description-textarea] textarea', 'feedbackError--');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button] button');

  contributorValue = value('[data-test-eholdings-contributor-contributor] input')
  contributorType = value('[data-test-eholdings-contributor-type] select')

  toast = Toast

  name = fillable('[data-test-eholdings-title-name-field] input');
  nameHasError = hasClassBeginningWith('[data-test-eholdings-title-name-field] input', 'hasError--');

  selectPublicationType = fillable('[data-test-eholdings-publication-type-field] select');
  selectContributorType = fillable('[data-test-eholdings-contributor-type] select');
  publicationTypeValue = value('[data-test-eholdings-publication-type-field] select');
  fillEdition = fillable('[data-test-eholdings-edition-field] input');
  fillPublisher = fillable('[data-test-eholdings-publisher-name-field] input');
  editionValue = value('[data-test-eholdings-edition-field] input');
  publisherValue = value('[data-test-eholdings-publisher-name-field] input');
  publisherHasError = hasClassBeginningWith('[data-test-eholdings-publisher-name-field] input', 'hasError--');
  editionHasError = hasClassBeginningWith('[data-test-eholdings-edition-field] input', 'hasError--');
  fillContributor = fillable('[data-test-eholdings-contributor-contributor] input')
  publisherValue = value('[data-test-eholdings-publisher-name-field] input');
  publisherHasError = hasClassBeginningWith('[data-test-eholdings-publisher-name-field] input', 'hasError--');
  contributorHasError = hasClassBeginningWith('[data-test-eholdings-contributor-contributor] input', 'hasError--');
  contributorError = text('[data-test-eholdings-contributor-contributor] [class^="feedbackError--"]');

  removeContributorCollection = collection('[data-test-eholdings-contributor-fields-remove-row-button]', {
    remove: clickable('button')
  });
  contributorsWillBeRemoved = text('[data-test-eholdings-contributors-fields-saving-will-remove]');

  clickAddIdentifiersRowButton = clickable('[data-test-eholdings-identifiers-fields-add-row-button] button');
  identifiersRowList = collection('[data-test-eholdings-identifiers-fields-row]', {
    type: fillable('[data-test-eholdings-identifiers-fields-type] select'),
    id: fillable('[data-test-eholdings-identifiers-fields-id] input'),
    idHasError: hasClassBeginningWith('[data-test-eholdings-identifiers-fields-id] input', 'hasError--'),
    clickRemoveRowButton: clickable('[data-test-eholdings-identifiers-fields-remove-row-button] button')
  });
}

export default new TitleEditPage('[data-test-eholdings-details-view="title"]');

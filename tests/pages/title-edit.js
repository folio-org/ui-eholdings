import {
  clickable,
  fillable,
  isPresent,
  page,
  property,
  value
} from '@bigtest/interaction';
import { hasClassBeginningWith } from './helpers';
import Toast from './toast';

@page class TitleEditNavigationModal {}

@page class TitleEditPage {
  navigationModal = new TitleEditNavigationModal('#navigation-modal');

  clickCancel = clickable('[data-test-eholdings-title-cancel-button] button');
  clickSave = clickable('[data-test-eholdings-title-save-button] button');
  isSaveDisabled = property('disabled', '[data-test-eholdings-title-save-button] button');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="title"]');
  isPeerReviewed = property('checked', '[data-test-eholdings-peer-reviewed-field] input[type=checkbox]');
  checkPeerReviewed = clickable('[data-test-eholdings-peer-reviewed-field] input[type=checkbox]');

  descriptionField = value('[data-test-eholdings-description-textarea] textarea');
  fillDescription = fillable('[data-test-eholdings-description-textarea] textarea');
  descriptionError = hasClassBeginningWith('feedbackError--', '[data-test-eholdings-description-textarea] textarea');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button] button');

  toast = Toast

  name = fillable('[data-test-eholdings-title-name-field] input');
  nameHasError = hasClassBeginningWith('feedbackError--', '[data-test-eholdings-title-name-field] input');

  selectPublicationType = fillable('[data-test-eholdings-publication-type-field] select');
  publicationTypeValue = value('[data-test-eholdings-publication-type-field] select');
  fillPublisher = fillable('[data-test-eholdings-publisher-name-field] input');
  publisherValue = value('[data-test-eholdings-publisher-name-field] input');
  publisherHasError = hasClassBeginningWith('feedbackError--', '[data-test-eholdings-publisher-name-field] input');
}

export default new TitleEditPage('[data-test-eholdings-details-view="title"]');

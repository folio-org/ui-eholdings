import {
  blurrable,
  clickable,
  collection,
  fillable,
  isPresent,
  interactor,
  property,
  text,
  value
} from '@bigtest/interactor';
import { hasClassBeginningWith } from './helpers';
import Toast from './toast';


@interactor class ResourceShowDeselectionModal {
  confirmDeselection = clickable('[data-test-eholdings-resource-deselection-confirmation-modal-yes]');
  cancelDeselection = clickable('[data-test-eholdings-resource-deselection-confirmation-modal-no]');
  hasDeselectTitleWarning = isPresent('[data-test-eholdings-deselect-title-warning]');
  hasDeselectFinalTitleWarning = isPresent('[data-test-eholdings-deselect-final-title-warning]');
}

@interactor class ResourceShowNavigationModal {}

@interactor class ResourceShowPage {
  titleName = text('[data-test-eholdings-details-view-name="resource"]');
  descriptionText = text('[data-test-eholdings-description-field]');
  publisherName = text('[data-test-eholdings-resource-show-publisher-name]');
  publicationType = text('[data-test-eholdings-resource-show-publication-type]');
  hasPublicationType = isPresent('[data-test-eholdings-resource-show-publication-type]');
  subjectsList = text('[data-test-eholdings-resource-show-subjects-list]');
  providerName = text('[data-test-eholdings-resource-show-provider-name]');
  clickProvider = clickable('[data-test-eholdings-resource-show-provider-name] a');
  packageName = text('[data-test-eholdings-resource-show-package-name]');
  url = text('[data-test-eholdings-resource-show-url]');
  contentType = text('[data-test-eholdings-resource-show-content-type]');
  hasContentType = isPresent('[data-test-eholdings-resource-show-content-type]');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="resource"]');
  isSelected = property('[data-test-eholdings-resource-show-selected] input', 'checked');
  isSelecting = hasClassBeginningWith('[data-test-eholdings-resource-show-selected] [data-test-toggle-switch]', 'is-pending--');
  addCoverage = clickable('[data-test-eholdings-coverage-form-add-button] button');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button] button');
  clickBackButton = clickable('[data-test-eholdings-details-view-back-button] button');
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  paneSub = text('[data-test-eholdings-details-view-pane-sub]');
  isSelectedToggleDisabled = property('[data-test-eholdings-resource-show-selected] input[type=checkbox]', 'disabled');
  toggleIsSelected = clickable('[data-test-eholdings-resource-show-selected] input');
  isEditingCustomEmbargo = isPresent('[data-test-eholdings-embargo-form] form');
  clickPackage = clickable('[data-test-eholdings-resource-show-package-name] a');
  deselectionModal = new ResourceShowDeselectionModal('#eholdings-resource-deselection-confirmation-modal');
  navigationModal = new ResourceShowNavigationModal('#navigation-modal');
  hasHiddenToggle = isPresent('[data-test-eholdings-resource-toggle-hidden] input');
  isResourceVisible = property('[data-test-eholdings-resource-toggle-hidden] input', 'checked');
  hiddenReason = text('[data-test-eholdings-resource-toggle-hidden-reason]');
  isHiddenDisabled = property('[data-test-eholdings-resource-toggle-hidden] input[type=checkbox]', 'disabled');
  toggleIsHidden = clickable('[data-test-eholdings-resource-toggle-hidden] input');
  isHiding = hasClassBeginningWith('[data-test-eholdings-resource-toggle-hidden] [data-test-toggle-switch]', 'is-pending--');
  clickEditButton = clickable('[data-test-eholdings-resource-edit-link]');

  peerReviewedStatus = text('[data-test-eholdings-peer-reviewed-field]');

  toast = Toast

  managedEmbargoPeriod = text('[data-test-eholdings-resource-show-managed-embargo-period]');
  hasManagedEmbargoPeriod = isPresent('[data-test-eholdings-resource-show-managed-embargo-period]');
  customEmbargoPeriod = text('[data-test-eholdings-resource-custom-embargo-display]');
  hasCustomEmbargoPeriod = isPresent('[data-test-eholdings-resource-custom-embargo-display]');
  hasCustomEmbargoAddButton = isPresent('[data-test-eholdings-resource-add-custom-embargo-button] button');
  hasCustomEmbargoEditButton = isPresent('[data-test-eholdings-resource-edit-custom-embargo-button] button');
  clickCustomEmbargoAddButton = clickable('[data-test-eholdings-resource-add-custom-embargo-button] button');
  hasCustomEmbargoForm = isPresent('[data-test-eholdings-embargo-form] form');
  customEmbargoTextFieldValue = value('[data-test-eholdings-custom-embargo-textfield] input');
  inputEmbargoValue = fillable('[data-test-eholdings-custom-embargo-textfield] input');
  customEmbargoSelectValue = value('[data-test-eholdings-custom-embargo-select] select');
  selectEmbargoUnit = fillable('[data-test-eholdings-custom-embargo-select] select');
  clickCustomEmbargoSaveButton = clickable('[data-test-eholdings-inline-form-save-button] button');
  hasCustomEmbargoSaveButton = isPresent('[data-test-eholdings-inline-form-save-button] button');
  isCustomEmbargoSaveDisabled = property('[data-test-eholdings-inline-form-save-button] button', 'disabled');
  clickCustomEmbargoCancelButton = clickable('[data-test-eholdings-inline-form-cancel-button] button');
  hasCustomEmbargoCancelButton = isPresent('[data-test-eholdings-inline-form-cancel-button] button');
  isCustomEmbargoCancelDisabled = property('[data-test-eholdings-inline-form-cancel-button] button', 'disabled');
  validationErrorOnTextField = text('[data-test-eholdings-custom-embargo-textfield] [class^="feedbackError--"]');
  validationErrorOnSelect = text('[data-test-eholdings-custom-embargo-select] [class^="feedbackError--"]');
  clickCustomEmbargoEditButton = clickable('[data-test-eholdings-resource-edit-custom-embargo-button] button');

  coverageStatement = text('[data-test-eholdings-resource-coverage-statement-display]');
  hasCoverageStatement = isPresent('[data-test-eholdings-resource-coverage-statement-display]');
  hasCoverageStatementAddButton = isPresent('[data-test-eholdings-resource-add-coverage-statement-button] button');
  clickCoverageStatementAddButton = clickable('[data-test-eholdings-resource-add-coverage-statement-button] button');
  hasCoverageStatementForm = isPresent('[data-test-eholdings-resource-coverage-statement-form] form');
  coverageStatementFieldValue = value('[data-test-eholdings-coverage-statement-textarea] textarea');
  clickCoverageStatementEditButton = clickable('[data-test-eholdings-resource-edit-coverage-statement-button] button');
  hasCoverageStatementEditButton = isPresent('[data-test-eholdings-resource-edit-coverage-statement-button] button');
  clickCoverageStatementSaveButton = clickable('[data-test-eholdings-inline-form-save-button] button');
  hasCoverageStatementSaveButton = isPresent('[data-test-eholdings-inline-form-save-button] button');
  isCoverageStatementSaveDisabled = property('[data-test-eholdings-inline-form-save-button] button', 'disabled');
  clickCoverageStatementCancelButton = clickable('[data-test-eholdings-inline-form-cancel-button] button');
  hasCoverageStatementCancelButton = isPresent('[data-test-eholdings-inline-form-cancel-button] button');
  isCoverageStatementCancelDisabled = property('[data-test-eholdings-inline-form-cancel-button] button', 'disabled');
  fillCoverageStatement = fillable('[data-test-eholdings-coverage-statement-textarea] textarea');
  blurCoverageStatement = blurrable('[data-test-eholdings-coverage-statement-textarea] textarea');
  coverageStatementHasError = hasClassBeginningWith('[data-test-eholdings-coverage-statement-textarea] textarea', 'feedbackError--');
  validationErrorOnCoverageStatement = text('[data-test-eholdings-coverage-statement-textarea] [class^="feedbackError--"]');

  inputCoverageStatement(statement) {
    return this
      .fillCoverageStatement(statement)
      .blurCoverageStatement();
  }
  managedCoverageList = text('[data-test-eholdings-resource-show-managed-coverage-list]');
  hasManagedCoverageList = isPresent('[data-test-eholdings-resource-show-managed-coverage-list]');

  identifiersList = collection('[data-test-eholdings-identifiers-list-item]', {
    indentifierText: text()
  });

  contributorsList = collection('[data-test-eholdings-contributors-list-item]', {
    contributorText: text()
  });
}

export default new ResourceShowPage('[data-test-eholdings-details-view="resource"]');

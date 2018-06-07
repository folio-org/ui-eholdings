import {
  clickable,
  collection,
  computed,
  isPresent,
  interactor,
  property,
  text
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
  edition = text('[data-test-eholdings-resource-show-edition]');
  descriptionText = text('[data-test-eholdings-description-field]');
  publisherName = text('[data-test-eholdings-resource-show-publisher-name]');
  publicationType = text('[data-test-eholdings-resource-show-publication-type]');
  hasPublicationType = isPresent('[data-test-eholdings-resource-show-publication-type]');
  subjectsList = text('[data-test-eholdings-resource-show-subjects-list]');
  providerName = text('[data-test-eholdings-resource-show-provider-name]');
  clickProvider = clickable('[data-test-eholdings-resource-show-provider-name] a');
  packageName = text('[data-test-eholdings-resource-show-package-name]');
  isUrlPresent = isPresent('[data-test-eholdings-resource-show-url]');
  url = text('[data-test-eholdings-resource-show-url]');
  contentType = text('[data-test-eholdings-resource-show-content-type]');
  hasContentType = isPresent('[data-test-eholdings-resource-show-content-type]');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="resource"]');
  isSelected = property('[data-test-eholdings-resource-show-selected] input', 'checked');
  isSelecting = hasClassBeginningWith('[data-test-eholdings-resource-show-selected] [data-test-toggle-switch]', 'is-pending--');
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
  resourceVisibilityLabel = text('[data-test-eholdings-resource-hidden-label]');
  isResourceHidden = computed(function () {
    return this.resourceVisibilityLabel === 'Hidden from patrons';
  });
  isResourceVisible = computed(function () {
    return this.resourceVisibilityLabel === 'Visible to patrons';
  })
  hiddenReason = text('[data-test-eholdings-resource-hidden-reason]');
  isResourceNotShownLabelPresent = isPresent('[data-test-eholdings-resource-not-shown-label]');
  clickEditButton = clickable('[data-test-eholdings-resource-edit-link]');

  peerReviewedStatus = text('[data-test-eholdings-peer-reviewed-field]');

  toast = Toast

  managedEmbargoPeriod = text('[data-test-eholdings-resource-show-managed-embargo-period]');
  hasManagedEmbargoPeriod = isPresent('[data-test-eholdings-resource-show-managed-embargo-period]');
  customEmbargoPeriod = text('[data-test-eholdings-resource-custom-embargo-display]');
  hasCustomEmbargoPeriod = isPresent('[data-test-eholdings-resource-custom-embargo-display]');
  hasNoEmbargoPeriod = isPresent('[data-test-eholdings-resource-no-embargo-label]');

  coverageStatement = text('[data-test-eholdings-resource-coverage-statement-display]');
  hasCoverageStatement = isPresent('[data-test-eholdings-resource-coverage-statement-display]');
  hasNoCoverageStatement = isPresent('[data-test-eholdings-resource-no-coverage-label]');
  hasCoverageNotShownStatement = isPresent('[data-test-eholdings-resource-coverage-not-shown-label]');

  managedCoverageList = text('[data-test-eholdings-resource-show-managed-coverage-list]');
  hasManagedCoverageList = isPresent('[data-test-eholdings-resource-show-managed-coverage-list]');

  customCoverageList = text('[data-test-eholdings-resource-show-custom-coverage-list]');
  hasCustomCoverageList = isPresent('[data-test-eholdings-resource-show-custom-coverage-list]');
  hasNoCoverageDate = isPresent('[data-test-eholdings-resource-no-coverage-date-label]');

  identifiersList = collection('[data-test-eholdings-identifiers-list-item]', {
    indentifierText: text()
  });

  contributorsList = collection('[data-test-eholdings-contributors-list-item]', {
    contributorText: text()
  });
}

export default new ResourceShowPage('[data-test-eholdings-details-view="resource"]');

import {
  clickable,
  collection,
  computed,
  isPresent,
  interactor,
  property,
  attribute,
  text,
  is
} from '@bigtest/interactor';
import Toast from './toast';


@interactor class ResourceShowDeselectionModal {
  confirmDeselection = clickable('[data-test-eholdings-resource-deselection-confirmation-modal-yes]');
  cancelDeselection = clickable('[data-test-eholdings-resource-deselection-confirmation-modal-no]');
  hasDeselectTitleWarning = isPresent('[data-test-eholdings-deselect-title-warning]');
  hasDeselectFinalTitleWarning = isPresent('[data-test-eholdings-deselect-final-title-warning]');
}

@interactor class ResourceShowDropDown {
  clickDropDownButton = clickable('button');
  isExpanded = attribute('button', 'aria-expanded');
}

@interactor class ResourceShowDropDownMenu {
  clickRemoveFromHoldings = clickable('.tether-element [data-test-eholdings-remove-resource-from-holdings]');
  clickAddToHoldings = clickable('.tether-element [data-test-eholdings-add-resource-to-holdings]');
}

@interactor class ResourceShowNavigationModal {}

@interactor class ResourceShowPage {
  isLoaded = isPresent('[data-test-eholdings-details-view-name="resource"]');
  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  titleName = text('[data-test-eholdings-details-view-name="resource"]');
  nameHasFocus = is('[data-test-eholdings-details-view-name="resource"]', ':focus');
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
  isExternalLinkIconPresent = isPresent('[data-test-eholdings-resource-show-external-link-icon]');
  contentType = text('[data-test-eholdings-resource-show-content-type]');
  hasContentType = isPresent('[data-test-eholdings-resource-show-content-type]');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="resource"]');
  isResourceSelected = text('[data-test-eholdings-resource-show-selected] div');
  isLoading = isPresent('[data-test-eholdings-resource-show-selected] [class*=icon---][class*=iconSpinner]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  hasCollapseAllButton = isPresent('[data-test-eholdings-details-view-collapse-all-button]');
  collapseAllButtonText = text('[data-test-eholdings-details-view-collapse-all-button]');
  clickCollapseAllButton = clickable('[data-test-eholdings-details-view-collapse-all-button] button');
  clickBackButton = clickable('[data-test-eholdings-details-view-back-button]');
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  paneSub = text('[data-test-eholdings-details-view-pane-sub]');
  isSelectedToggleDisabled = property('[data-test-eholdings-resource-show-selected] input[type=checkbox]', 'disabled');
  toggleIsSelected = clickable('[data-test-eholdings-resource-show-holding-status] input');
  isEditingCustomEmbargo = isPresent('[data-test-eholdings-embargo-form] form');
  clickPackage = clickable('[data-test-eholdings-resource-show-package-name] a');
  clickAddToHoldingsButton = clickable('[data-test-eholdings-resource-add-to-holdings-button]');
  isAddToHoldingsButtonDisabled = property('[data-test-eholdings-resource-add-to-holdings-button]', 'disabled');
  dropDown= new ResourceShowDropDown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  dropDownMenu = new ResourceShowDropDownMenu();
  deselectionModal = new ResourceShowDeselectionModal('#eholdings-resource-deselection-confirmation-modal');
  navigationModal = new ResourceShowNavigationModal('#navigation-modal');
  resourceVisibilityLabel = text('[data-test-eholdings-resource-show-visibility]');
  proxy = text('[data-test-eholdings-details-proxy]');
  isResourceHidden = computed(function () {
    return /^No/.test(this.resourceVisibilityLabel);
  });

  hasAddTokenButton = isPresent('[data-test-add-token-button]');
  clickAddTokenButton = clickable('[data-test-add-token-button]');

  isResourceVisible = computed(function () {
    return this.resourceVisibilityLabel === 'Yes';
  });

  hiddenReason = computed(function () {
    return this.isResourceHidden ? this.resourceVisibilityLabel.replace(/^No(\s\((.*)\))?$/, '$2') : '';
  });

  clickEditButton = clickable('[data-test-eholdings-resource-edit-link]');
  peerReviewedStatus = text('[data-test-eholdings-peer-reviewed-field]');

  toast = Toast;

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

  isNotSelectedCoverageMessagePresent = isPresent('[data-test-eholdings-resource-not-selected-coverage-message]');
  hasNoCustomizationsMessage = isPresent('[data-test-eholdings-resource-not-selected-no-customization-message]');

  identifiersList = collection('[data-test-eholdings-identifiers-list-item]', {
    indentifierText: text()
  });

  contributorsList = collection('[data-test-eholdings-contributors-list-item]', {
    contributorText: text()
  });
}

export default new ResourceShowPage('[data-test-eholdings-details-view="resource"]');

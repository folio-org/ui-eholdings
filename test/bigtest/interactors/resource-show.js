import {
  action,
  clickable,
  collection,
  computed,
  isPresent,
  interactor,
  property,
  text,
  is
} from '@bigtest/interactor';
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import AgreementsAccordion from './agreements-accordion';
import CustomLabel from './custom-label';
import Toast from './toast';
import ActionsDropDown from './actions-drop-down';
import ResourceDropDownMenu from './resource-drop-down-menu';
import NavigationModal from './navigation-modal';
import ResourceShowDeselectionModal from './resource-show-deselection-modal';

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
  accessType = text('[data-test-eholdings-details-access-type]');
  isAccessTypeSectionPresent = isPresent('[data-test-eholdings-details-access-type]');
  isExternalLinkIconPresent = isPresent('[data-test-eholdings-resource-show-external-link-icon]');
  contentType = text('[data-test-eholdings-resource-show-content-type]');
  hasContentType = isPresent('[data-test-eholdings-resource-show-content-type]');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="resource"]');
  isResourceSelected = text('[data-test-eholdings-resource-show-selected] div');
  isLoading = isPresent('[data-test-eholdings-resource-show-selected] [class*=icon---] [class*=icon-spinner]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  hasCollapseAllButton = isPresent('[data-test-eholdings-details-view-collapse-all-button]');
  collapseAllButtonText = text('[data-test-eholdings-details-view-collapse-all-button]');
  clickCollapseAllButton = clickable('[data-test-eholdings-details-view-collapse-all-button] button');
  clickBackButton = clickable('[data-test-eholdings-details-view-back-button]');
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  paneSub = text('[data-test-eholdings-details-view-pane-sub]');
  isTagsPresent = isPresent('[data-test-eholdings-details-tags]');
  isSelectedToggleDisabled = property('[data-test-eholdings-resource-show-selected] input[type=checkbox]', 'disabled');
  toggleIsSelected = clickable('[data-test-eholdings-resource-show-holding-status] input');
  isEditingCustomEmbargo = isPresent('[data-test-eholdings-embargo-form] form');
  clickPackage = clickable('[data-test-eholdings-resource-show-package-name] a');
  clickAddToHoldingsButton = clickable('[data-test-eholdings-resource-add-to-holdings-button]');
  isAddToHoldingsButtonDisabled = property('[data-test-eholdings-resource-add-to-holdings-button]', 'disabled');
  actionsDropDown= ActionsDropDown;
  dropDownMenu = new ResourceDropDownMenu();
  deselectionModal = new ResourceShowDeselectionModal('#eholdings-resource-deselection-confirmation-modal');
  navigationModal = NavigationModal;
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

  clickEditButton= action(function () {
    return this
      .actionsDropDown.clickDropDownButton()
      .dropDownMenu.clickEdit();
  });

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

  agreementsSection = new AgreementsAccordion('#resourceShowAgreements');

  customLabelsAccordion = new AccordionInteractor('#resourceShowCustomLabels');
  customLabels = collection('[data-test-eholdings-resource-custom-label]', CustomLabel);
}

export default new ResourceShowPage('[data-test-eholdings-details-view="resource"]');

import {
  action,
  blurrable,
  clickable,
  collection,
  scoped,
  fillable,
  isPresent,
  interactor,
  property,
  text,
  value,
  computed,
  selectable
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import { hasClassBeginningWith } from './helpers';

import Toast from './toast';
import Datepicker from './datepicker';

@interactor class ResourceEditNavigationModal {
  cancelNavigation = clickable('[data-test-navigation-modal-dismiss]');
  confirmNavigation = clickable('[data-test-navigation-modal-continue]');
}

@interactor class ResourceEditModal {
  confirmDeselection = clickable('[data-test-eholdings-resource-deselection-confirmation-modal-yes]');
  cancelDeselection = clickable('[data-test-eholdings-resource-deselection-confirmation-modal-no]');
  confirmButtonText = text('[data-test-eholdings-resource-deselection-confirmation-modal-yes]');
  confirmButtonIsDisabled = property('[data-test-eholdings-resource-deselection-confirmation-modal-yes]', 'disabled');
}

@interactor class ResourceEditDropDown {
  clickDropDownButton = clickable('button');
}

@interactor class ResourceEditDropDownMenu {
  clickCancel = clickable('.tether-element [data-test-eholdings-resource-cancel-action]');
}

@interactor class ResourceEditToggleSectionButton {
  exists = isPresent('[data-test-eholdings-details-view-collapse-all-button]]');
  label = text('[data-test-eholdings-details-view-collapse-all-button]]');
  click = clickable('[data-test-eholdings-details-view-collapse-all-button] button');
}

@interactor class ResourceEditPage {
  isLoaded = isPresent('[data-test-eholdings-details-view-pane-title]');
  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  navigationModal = new ResourceEditNavigationModal('#navigation-modal');

  addToHoldingsButton = isPresent('[data-test-eholdings-resource-add-to-holdings-button]');

  clickCancel= action(function () {
    return this
      .dropDown.clickDropDownButton()
      .dropDownMenu.clickCancel();
  });

  toggleSectionButton = new ResourceEditToggleSectionButton();
  resourceHoldingStatusAccordion = new AccordionInteractor('#resourceShowHoldingStatus');
  resourceSettingsAccordion = new AccordionInteractor('#resourceShowSettings');
  resourceCoverageSettingsAccordion = new AccordionInteractor('#resourceShowCoverageSettings');

  clickSave = clickable('[data-test-eholdings-resource-save-button]');
  hasSaveButon = isPresent('[data-test-eholdings-resource-save-button]');
  hasCancelButton = isPresent('[data-test-eholdings-resource-cancel-button]');
  isSaveDisabled = property('[data-test-eholdings-resource-save-button]', 'disabled');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="resource"]');
  isPeerReviewed = property('[data-test-eholdings-peer-reviewed-field] input[type=checkbox]', 'checked');
  checkPeerReviewed = clickable('[data-test-eholdings-peer-reviewed-field] input[type=checkbox]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  isResourceSelected = text('[data-test-eholdings-resource-holding-status] div');
  isResourceSelectedBoolean = isPresent('[data-test-eholdings-resource-holding-status] div');
  isResourceVisible = property('[data-test-eholdings-resource-visibility-field] input[value="true"]', 'checked');
  isResourceShowToPatronsVisible = isPresent('[data-test-eholdings-resource-visibility-field]');
  isCoverageSettingsDatesField = isPresent('[data-test-eholdings-resource-coverage-fields]');
  isHiddenMessage = computed(function () {
    let $node = this.$('[data-test-eholdings-resource-visibility-field] input[value="false"] ~ span:last-child');
    return $node.textContent.replace(/^No(\s\((.*)\))?$/, '$2');
  });

  isHiddenMessagePresent = computed(function () {
    try { return !!this.isHiddenMessage; } catch (e) { return false; }
  });

  isVisibilityFieldPresent = isPresent('[data-test-eholdings-resource-visibility-field]');
  isResourceNotSelectedLabelPresent = isPresent('[data-test-eholdings-resource-edit-settings-message]');

  toggleIsSelected = clickable('[data-test-eholdings-resource-holding-status] input');
  toggleIsVisible() {
    let isVisible = (!this.isResourceVisible).toString();
    return this.click(`[data-test-eholdings-resource-visibility-field] input[value="${isVisible}"]`);
  }

  modal = new ResourceEditModal('#eholdings-resource-confirmation-modal');
  toast = Toast;

  name = fillable('[data-test-eholdings-resource-name-field] input');
  nameHasError = hasClassBeginningWith('[data-test-eholdings-resource-name-field] [class*=inputGroup--]', 'hasError--');

  clickAddRowButton = clickable('[data-test-eholdings-resource-coverage-fields] [data-test-repeatable-field-add-item-button]');

  dateRangeRowList = collection('[data-test-eholdings-resource-coverage-fields] li', {
    beginDate: scoped('[data-test-eholdings-coverage-fields-date-range-begin]', Datepicker),
    endDate: scoped('[data-test-eholdings-coverage-fields-date-range-end]', Datepicker),
    clickRemoveRowButton: clickable('[data-test-repeatable-field-remove-item-button]'),
    fillDates(beginDate, endDate) {
      return this.beginDate.fillAndBlur(beginDate)
        .endDate.fillAndBlur(endDate);
    }
  });

  hasSavingWillRemoveMessage = isPresent('[data-test-eholdings-resource-coverage-fields] [data-test-repeatable-field-empty-message]');
  hasCoverageStatementArea = isPresent('[data-test-eholdings-coverage-statement-textarea] textarea');
  coverageStatement = value('[data-test-eholdings-coverage-statement-textarea] textarea');
  customUrlFieldValue = value('[data-test-eholdings-custom-url-textfield] input');
  fillCoverageStatement = fillable('[data-test-eholdings-coverage-statement-textarea] textarea');
  blurCoverageStatement = blurrable('[data-test-eholdings-coverage-statement-textarea] textarea');
  coverageStatementHasError = hasClassBeginningWith('[data-test-eholdings-coverage-statement-textarea] textarea', 'hasError--');
  validationErrorOnCoverageStatement = text('[data-test-eholdings-coverage-statement-textarea] [class^="feedbackError--"]');

  inputCoverageStatement = action(function (statement) {
    return this
      .fillCoverageStatement(statement)
      .blurCoverageStatement();
  });

  customEmbargoTextFieldValue = value('[data-test-eholdings-custom-embargo-textfield] input');
  hasCustomEmbargoTextField = isPresent('[data-test-eholdings-custom-embargo-textfield] input');
  inputEmbargoValue = fillable('[data-test-eholdings-custom-embargo-textfield] input');
  inputCustomUrlValue = fillable('[data-test-eholdings-custom-url-textfield] input');
  customEmbargoSelectValue = value('[data-test-eholdings-custom-embargo-select] select');
  hasCustomEmbargoSelect = isPresent('[data-test-eholdings-custom-embargo-select] select');
  hasCustomUrlField = isPresent('[data-test-eholdings-custom-url-textfield]');
  selectEmbargoUnit = fillable('[data-test-eholdings-custom-embargo-select] select');
  blurEmbargoValue = blurrable('[data-test-eholdings-custom-embargo-textfield] input');
  blurEmbargoUnit = blurrable('[data-test-eholdings-custom-embargo-select] select');
  validationErrorOnEmbargoTextField = text('[data-test-eholdings-custom-embargo-textfield] [class^="feedbackError--"]');
  validationErrorOnEmbargoSelect = text('[data-test-eholdings-custom-embargo-select] [class^="feedbackError--"]');
  hasAddCustomCoverageButton = isPresent('[data-test-eholdings-resource-coverage-fields] [data-test-repeatable-field-add-item-button]');
  hasAddCustomEmbargoButton = isPresent('[data-test-eholdings-custom-embargo-add-row-button] button');
  clickAddCustomEmbargoButton = clickable('[data-test-eholdings-custom-embargo-add-row-button] button');
  hasSavingWillRemoveEmbargoMessage = isPresent('[data-test-eholdings-embargo-fields-saving-will-remove]');
  clickRemoveCustomEmbargoButton = clickable('[data-test-eholdings-custom-embargo-remove-row-button] button');
  isEmbargoNotShownLabelPresent = isPresent('[data-test-eholdings-resource-embargo-not-shown-label]');
  validationErrorOnCustomUrl = text('[data-test-eholdings-custom-url-textfield] [class^="feedbackError--"]');
  managedCoverageDisplay = text('[data-test-eholdings-resource-edit-managed-coverage-list]');

  selectPublicationType = fillable('[data-test-eholdings-publication-type-field] select');
  publicationTypeValue = value('[data-test-eholdings-publication-type-field] select');
  fillPublisher = fillable('[data-test-eholdings-publisher-name-field] input');
  publisherValue = value('[data-test-eholdings-publisher-name-field] input');
  publisherHasError = hasClassBeginningWith('[data-test-eholdings-publisher-name-field] [class*=inputGroup--]', 'hasError--');
  proxySelectValue = value('[data-test-eholdings-resource-proxy-select] select');
  chooseProxy = selectable('[data-test-eholdings-resource-proxy-select] select');

  dropDown = new ResourceEditDropDown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  dropDownMenu = new ResourceEditDropDownMenu();
}

export default new ResourceEditPage('[data-test-eholdings-details-view="resource"]');

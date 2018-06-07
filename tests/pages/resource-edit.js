import {
  action,
  blurrable,
  clickable,
  collection,
  fillable,
  isPresent,
  interactor,
  property,
  text,
  value,
  computed
} from '@bigtest/interactor';
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
}

@interactor class ResourceEditPage {
  navigationModal = new ResourceEditNavigationModal('#navigation-modal');

  clickCancel = clickable('[data-test-eholdings-resource-cancel-button] button');
  clickSave = clickable('[data-test-eholdings-resource-save-button] button');
  isSaveDisabled = property('[data-test-eholdings-resource-save-button] button', 'disabled');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="resource"]');
  isPeerReviewed = property('[data-test-eholdings-peer-reviewed-field] input[type=checkbox]', 'checked');
  checkPeerReviewed = clickable('[data-test-eholdings-peer-reviewed-field] input[type=checkbox]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button] button');
  isSelected = property('[data-test-eholdings-resource-holding-status] input', 'checked');
  isResourceVisible = property('[data-test-eholdings-resource-visibility-field] input[value="true"]', 'checked');
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
  nameHasError = hasClassBeginningWith('[data-test-eholdings-resource-name-field] input', 'hasError--');

  clickAddRowButton = clickable('[data-test-eholdings-coverage-fields-add-row-button] button');

  dateRangeRowList = collection('[data-test-eholdings-coverage-fields-date-range-row]', {
    beginDate: new Datepicker('[data-test-eholdings-coverage-fields-date-range-begin]'),
    endDate: new Datepicker('[data-test-eholdings-coverage-fields-date-range-end]'),
    clickRemoveRowButton: clickable('[data-test-eholdings-coverage-fields-remove-row-button] button'),
    fillDates(beginDate, endDate) {
      return this.beginDate.fillAndBlur(beginDate)
        .endDate.fillAndBlur(endDate);
    }
  });

  hasSavingWillRemoveMessage = isPresent('[data-test-eholdings-coverage-fields-saving-will-remove]');
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
  hasAddCustomCoverageButton = isPresent('[data-test-eholdings-coverage-fields-add-row-button] button');
  hasAddCustomEmbargoButton = isPresent('[data-test-eholdings-custom-embargo-add-row-button] button');
  clickAddCustomEmbargoButton = clickable('[data-test-eholdings-custom-embargo-add-row-button] button');
  hasSavingWillRemoveEmbargoMessage = isPresent('[data-test-eholdings-embargo-fields-saving-will-remove]');
  clickRemoveCustomEmbargoButton = clickable('[data-test-eholdings-custom-embargo-remove-row-button] button');
  isEmbargoNotShownLabelPresent = isPresent('[data-test-eholdings-resource-embargo-not-shown-label]');
  validationErrorOnCustomUrl = text('[data-test-eholdings-custom-url-textfield] [class^="feedbackError--"]');

  selectPublicationType = fillable('[data-test-eholdings-publication-type-field] select');
  publicationTypeValue = value('[data-test-eholdings-publication-type-field] select');
  fillPublisher = fillable('[data-test-eholdings-publisher-name-field] input');
  publisherValue = value('[data-test-eholdings-publisher-name-field] input');
  publisherHasError = hasClassBeginningWith('[data-test-eholdings-publisher-name-field] input', 'hasError--');
}

export default new ResourceEditPage('[data-test-eholdings-details-view="resource"]');

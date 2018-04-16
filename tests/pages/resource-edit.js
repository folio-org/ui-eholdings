import {
  action,
  blurrable,
  clickable,
  collection,
  fillable,
  isPresent,
  page,
  property,
  text,
  value
} from '@bigtest/interaction';
import { hasClassBeginningWith } from './helpers';
import Toast from './toast';
import Datepicker from './datepicker';

@page class ResourceEditNavigationModal {}

@page class ResourceEditPage {
  navigationModal = new ResourceEditNavigationModal('#navigation-modal');

  clickCancel = clickable('[data-test-eholdings-resource-cancel-button] button');
  clickSave = clickable('[data-test-eholdings-resource-save-button] button');
  isSaveDisabled = property('disabled', '[data-test-eholdings-resource-save-button] button');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="resource"]');
  isPeerReviewed = property('checked', '[data-test-eholdings-peer-reviewed-field] input[type=checkbox]');
  checkPeerReviewed = clickable('[data-test-eholdings-peer-reviewed-field] input[type=checkbox]');

  toast = Toast

  name = fillable('[data-test-eholdings-resource-name-field] input');
  nameHasError = hasClassBeginningWith('feedbackError--', '[data-test-eholdings-resource-name-field] input');

  clickAddRowButton = clickable('[data-test-eholdings-coverage-fields-add-row-button] button');

  dateRangeRowList = collection('[data-test-eholdings-coverage-fields-date-range-row]', {
    beginDate: new Datepicker('[data-test-eholdings-coverage-fields-date-range-begin]'),
    endDate: new Datepicker('[data-test-eholdings-coverage-fields-date-range-end]'),
    clickRemoveRowButton: clickable('[data-test-eholdings-coverage-fields-remove-row-button] button'),
    fillDates(beginDate, endDate) {
      return this.beginDate.fillAndBlur(beginDate)
        .append(this.endDate.fillAndBlur(endDate));
    }
  });

  coverageStatement = value('[data-test-eholdings-coverage-statement-textarea] textarea');
  fillCoverageStatement = fillable('[data-test-eholdings-coverage-statement-textarea] textarea');
  blurCoverageStatement = blurrable('[data-test-eholdings-coverage-statement-textarea] textarea');
  coverageStatementHasError = hasClassBeginningWith('feedbackError--', '[data-test-eholdings-coverage-statement-textarea] textarea');
  validationErrorOnCoverageStatement = text('[data-test-eholdings-coverage-statement-textarea] [class^="feedbackError--"]');

  inputCoverageStatement = action(function (statement) {
    return this
      .fillCoverageStatement(statement)
      .blurCoverageStatement();
  });

  customEmbargoTextFieldValue = value('[data-test-eholdings-custom-embargo-textfield] input');
  inputEmbargoValue = fillable('[data-test-eholdings-custom-embargo-textfield] input');
  customEmbargoSelectValue = value('[data-test-eholdings-custom-embargo-select] select');
  selectEmbargoUnit = fillable('[data-test-eholdings-custom-embargo-select] select');
  blurEmbargoValue = blurrable('[data-test-eholdings-custom-embargo-textfield] input');
  blurEmbargoUnit = blurrable('[data-test-eholdings-custom-embargo-select] select');
  validationErrorOnEmbargoTextField = text('[data-test-eholdings-custom-embargo-textfield] [class^="feedbackError--"]')

  selectPublicationType = fillable('[data-test-eholdings-publication-type-field] select');
  publicationTypeValue = value('[data-test-eholdings-publication-type-field] select');
  fillPublisher = fillable('[data-test-eholdings-publisher-name-field] input');
  publisherValue = value('[data-test-eholdings-publisher-name-field] input');
  publisherHasError = hasClassBeginningWith('feedbackError--', '[data-test-eholdings-publisher-name-field] input');
}

export default new ResourceEditPage('[data-test-eholdings-details-view="resource"]');

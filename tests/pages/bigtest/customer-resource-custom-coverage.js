import {
  blurrable,
  clickable,
  collection,
  computed,
  fillable,
  isPresent,
  page,
  property,
  text,
  triggerable
} from '@bigtest/interaction';
import { isRootPresent } from '../helpers';

let hasClassBeginningWith = (className, selector) => {
  return computed(function () {
    return this.$(selector).className.includes(className);
  });
};

@page class CustomerResourceCustomCoveragePage {
  exists = isRootPresent();
  clickAddButton = clickable('[data-test-eholdings-coverage-form-add-button] button');
  hasForm = isPresent('[data-test-eholdings-coverage-form] form');
  clickCancelButton = clickable('[data-test-eholdings-coverage-form-cancel-button] button');
  clickSaveButton = clickable('[data-test-eholdings-coverage-form-save-button] button');
  clickEditButton = clickable('[data-test-eholdings-coverage-form-edit-button] button')
  hasCancelButton = isPresent('[data-test-eholdings-coverage-form-cancel-button] button');
  isSaveButtonDisabled = property('disabled', '[data-test-eholdings-coverage-form-save-button] button');
  hasSaveButton = isPresent('[data-test-eholdings-coverage-form-save-button] button');
  hasAddButton = isPresent('[data-test-eholdings-coverage-form-add-button] button');
  hasEditButton = isPresent('[data-test-eholdings-coverage-form-edit-button]');
  clickAddRowButton = clickable('[data-test-eholdings-coverage-form-add-row-button] button');
  displayText = text('[data-test-eholdings-coverage-form-display]');
  hasNoRowsLeftMessage = isPresent('[data-test-eholdings-coverage-form-no-rows-left]');

  dateRangeRowList = collection('[data-test-eholdings-coverage-form-date-range-row]', {
    clickBeginCoverage: clickable('[data-test-eholdings-coverage-form-date-range-begin] input'),
    hasBeginCoverage: isPresent('[data-test-eholdings-coverage-form-date-range-begin] input'),
    beginCoverageValue: text('[data-test-eholdings-coverage-form-date-range-begin] input'),
    beginCoverageFieldIsValid: hasClassBeginningWith('feedbackValid--', '[data-test-eholdings-coverage-form-date-range-begin] input'),
    beginCoverageFieldIsInvalid: hasClassBeginningWith('feedbackError--', '[data-test-eholdings-coverage-form-date-range-begin] input'),
    beginCoverageFieldValidationError: text('[data-test-eholdings-coverage-form-date-range-begin] div[class^=feedback]'),
    inputBeginDate: fillable('[data-test-eholdings-coverage-form-date-range-begin] input'),
    blurBeginDate: blurrable('[data-test-eholdings-coverage-form-date-range-begin] input'),
    clearBeginDate: clickable('[data-test-eholdings-coverage-form-date-range-begin] button[id^=datepicker-clear-button]'),
    pressEnterBeginDate: triggerable('keydown', '[data-test-eholdings-coverage-form-date-range-begin] input', {
      bubbles: true,
      cancelable: true,
      keyCode: 13
    }),
    hasEndCoverage: isPresent('[data-test-eholdings-coverage-form-date-range-end] input'),
    endCoverageValue: text('[data-test-eholdings-coverage-form-date-range-end] input'),
    endCoverageFieldIsValid: hasClassBeginningWith('feedbackValid--', '[data-test-eholdings-coverage-form-date-range-end] input'),
    endCoverageFieldIsInvalid: hasClassBeginningWith('feedbackError--', '[data-test-eholdings-coverage-form-date-range-end] input'),
    endCoverageFieldValidationError: text('[data-test-eholdings-coverage-form-date-range-end] div[class^=feedback]'),
    clickRemoveRowButton: clickable('[data-test-eholdings-coverage-form-remove-row-button] button'),
    clickEndCoverage: clickable('[data-test-eholdings-coverage-form-date-range-end] input'),
    inputEndDate: fillable('[data-test-eholdings-coverage-form-date-range-end] input'),
    blurEndDate: blurrable('[data-test-eholdings-coverage-form-date-range-end] input'),
    clearEndDate: clickable('[data-test-eholdings-coverage-form-date-range-end] button[id^=datepicker-clear-button]'),
    pressEnterEndDate: triggerable('keydown', '[data-test-eholdings-coverage-form-date-range-end] input', {
      bubbles: true,
      cancelable: true,
      keyCode: 13
    }),
    fillInDateRange(beginDate, endDate) {
      return this
        .clickBeginCoverage()
        .inputBeginDate(beginDate)
        .pressEnterBeginDate()
        .blurBeginDate()
        .clickEndCoverage()
        .inputEndDate(endDate)
        .pressEnterEndDate()
        .blurEndDate();
    },
  });
}

export default new CustomerResourceCustomCoveragePage('[data-test-eholdings-coverage-form]');

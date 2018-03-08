import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '@bigtest/convergence';
import { advancedFillIn, pressEnter } from './helpers';

function createRowObject(element) {
  let $scope = $(element);

  return {
    // Elements
    get $beginCoverageField() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-begin] input');
    },
    get $endCoverageField() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-end] input');
    },
    get $beginCoverageFeedback() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-begin] div[class^=feedback]');
    },
    get $endCoverageFeedback() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-end] div[class^=feedback]');
    },
    get $beginCoverageClearButton() {
      return $scope.find('#datepicker-clear-button-begin-coverage');
    },
    get $endCoverageClearButton() {
      return $scope.find('#datepicker-clear-button-end-coverage');
    },
    get $removeRowButton() {
      return $scope.find('[data-test-eholdings-coverage-form-remove-row-button] button');
    },

    // Observers
    get beginCoverageFieldValidationError() { return this.$beginCoverageFeedback.text(); },
    get endCoverageFieldValidationError() { return this.$endCoverageFeedback.text(); },
    get beginCoverageValue() { return this.$beginCoverageField.val(); },
    get endCoverageValue() { return this.$endCoverageField.val(); },

    get beginCoverageFieldIsValid() {
      return this.$beginCoverageField.attr('class').includes('feedbackValid--');
    },
    get beginCoverageFieldIsInvalid() {
      return this.$beginCoverageField.attr('class').includes('feedbackError--');
    },
    get endCoverageFieldIsValid() {
      return this.$endCoverageField.attr('class').includes('feedbackValid--');
    },
    get endCoverageFieldIsInvalid() {
      return this.$endCoverageField.attr('class').includes('feedbackError--');
    },

    // Actions
    pressEnterBeginDate() { pressEnter(this.$beginCoverageField); },
    pressEnterEndDate() { pressEnter(this.$endCoverageField); },

    inputBeginDate(beginDate) {
      return advancedFillIn(this.$beginCoverageField.get(0), beginDate);
    },
    inputEndDate(endDate) {
      return advancedFillIn(this.$endCoverageField.get(0), endDate);
    },
    clearBeginDate() {
      return convergeOn(() => expect(this.$beginCoverageClearButton).to.exist)
        .then(() => this.$beginCoverageClearButton.click());
    },
    clearEndDate() {
      return convergeOn(() => expect(this.$endCoverageClearButton).to.exist)
        .then(() => this.$endCoverageClearButton.click());
    },
    clickRemoveRowButton() {
      return convergeOn(() => expect(this.$removeRowButton).to.exist)
        .then(() => this.$removeRowButton.click());
    }
  };
}

export default {
  // Elements
  get $root() {
    return $('[data-test-eholdings-coverage-form]');
  },
  get $form() {
    return $('[data-test-eholdings-coverage-form] form');
  },
  get $editButton() {
    return $('[data-test-eholdings-coverage-form-edit-button] button');
  },
  get $addButton() {
    return $('[data-test-eholdings-coverage-form-add-button] button');
  },
  get $addRowButton() {
    return $('[data-test-eholdings-coverage-form-add-row-button] button');
  },
  get $cancelButton() {
    return $('[data-test-eholdings-coverage-form-cancel-button] button');
  },
  get $saveButton() {
    return $('[data-test-eholdings-coverage-form-save-button] button');
  },
  get $coverageDisplaySpan() {
    return $('[data-test-eholdings-coverage-form-display]');
  },
  get $dateRangeRows() {
    return $('[data-test-eholdings-coverage-form-date-range-row]');
  },
  get $noRowsLeftMessage() {
    return $('[data-test-eholdings-coverage-form-no-rows-left]');
  },

  // Observers
  get displayText() { return this.$coverageDisplaySpan.text(); },
  get isSaveButtonEnabled() { return this.$saveButton.prop('disabled') === false; },
  get dateRangeRowList() { return this.$dateRangeRows.toArray().map(createRowObject); },

  // Actions
  clickEditButton() {
    return convergeOn(() => expect(this.$editButton).to.exist)
      .then(() => this.$editButton.click());
  },
  clickAddButton() {
    return convergeOn(() => expect(this.$addButton).to.exist)
      .then(() => this.$addButton.click());
  },
  clickAddRowButton() {
    return convergeOn(() => expect(this.$addRowButton).to.exist)
      .then(() => this.$addRowButton.click());
  },
  clickCancelButton() {
    return convergeOn(() => expect(this.$cancelButton).to.exist)
      .then(() => this.$cancelButton.click());
  },
  clickSaveButton() {
    return convergeOn(() => expect(this.$saveButton).to.exist)
      .then(() => this.$saveButton.click());
  }
};

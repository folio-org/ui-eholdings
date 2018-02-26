import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '../it-will';
import { advancedFillIn, pressEnter } from './helpers';

function createRowObject(element) {
  let $scope = $(element);

  return {
    get $beginCoverageField() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-begin] input')[0];
    },

    get $endCoverageField() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-end] input')[0];
    },

    get beginCoverage() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-begin] input').val();
    },

    get endCoverage() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-end] input').val();
    },

    get beginCoverageFieldIsValid() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-begin] input').attr('class').includes('feedbackValid--');
    },

    get beginCoverageFieldIsInvalid() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-begin] input').attr('class').includes('feedbackError--');
    },

    get beginCoverageFieldValidationError() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-begin] div[class^=feedbackError]').text();
    },

    get endCoverageFieldIsInvalid() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-end] input').attr('class').includes('feedbackError--');
    },

    get endCoverageFieldValidationError() {
      return $scope.find('[data-test-eholdings-coverage-form-date-range-end] div[class^=feedbackError]').text();
    },

    get $removeRowButton() {
      return $scope.find('[data-test-eholdings-coverage-form-remove-row-button]');
    },

    clickRemoveRowButton() {
      return convergeOn(() => {
        expect($scope.find('[data-test-eholdings-coverage-form-remove-row-button]')).to.exist;
      }).then(() => {
        return $scope.find('[data-test-eholdings-coverage-form-remove-row-button] button').click();
      });
    },

    inputBeginDate(beginDate) {
      return advancedFillIn(this.$beginCoverageField, beginDate);
    },

    inputEndDate(endDate) {
      return advancedFillIn(this.$endCoverageField, endDate);
    },

    pressEnterBeginDate() {
      pressEnter(this.$beginCoverageField);
    },

    pressEnterEndDate() {
      pressEnter(this.$endCoverageField);
    },

    clearBeginDate() {
      let $clearButton = $('[data-test-eholdings-coverage-form-date-range-begin]')
          .find('button[id^=datepicker-clear-button-undefined]');
      return convergeOn(() => {
        expect($clearButton).to.exist;
      }).then(() => {
        $clearButton.click();
      });
    },

    clearEndDate() {
      let $clearButton = $('[data-test-eholdings-coverage-form-date-range-end]')
        .find('button[id^=datepicker-clear-button]');
      return convergeOn(() => {
        expect($clearButton).to.exist;
      }).then(() => {
        $clearButton.click();
      });
    },

    blurEndDate() {
      this.$endCoverageField.blur();
    },

    blurBeginDate() {
      this.$beginCoverageField.blur();
    }
  };
}

export default {
  get $root() {
    return $('[data-test-eholdings-coverage-form]');
  },

  get displayText() {
    return $('[data-test-eholdings-coverage-form-display]').text();
  },

  get $editButton() {
    return $('[data-test-eholdings-coverage-form-edit-button]');
  },

  get $addButton() {
    return $('[data-test-eholdings-coverage-form-add-button]');
  },

  get $form() {
    return $('[data-test-eholdings-coverage-form] form');
  },

  get $addRowButton() {
    return $('[data-test-eholdings-coverage-form-add-row-button]');
  },

  get $cancelButton() {
    return $('[data-test-eholdings-coverage-form-cancel-button] button');
  },

  get $saveButton() {
    return $('[data-test-eholdings-coverage-form-save-button] button');
  },

  get isSaveButtonEnabled() {
    return $('[data-test-eholdings-coverage-form-save-button] button').prop('disabled') === false;
  },

  get dateRangeRowList() {
    return $('[data-test-eholdings-coverage-form-date-range-row]').toArray().map(createRowObject);
  },

  get $noRowsLeftMessage() {
    return $('[data-test-eholdings-coverage-form-no-rows-left]');
  },

  clickEditButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-coverage-form-edit-button]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-coverage-form-edit-button] button').click()
    ));
  },

  clickAddButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-coverage-form-add-button]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-coverage-form-add-button] button').click()
    ));
  },

  clickAddRowButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-coverage-form-add-row-button]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-coverage-form-add-row-button] button').click()
    ));
  },

  clickSaveButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-coverage-form-save-button]')).to.exist;
    }).then(() => {
      return $('[data-test-eholdings-coverage-form-save-button] button').click();
    });
  }
};

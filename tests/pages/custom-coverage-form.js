import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '../it-will';
import { fillIn } from './helpers';

export default {
  get customCoverageText() {
    return $('[data-test-eholdings-custom-coverage-display]').text();
  },

  get $customCoverageAddButton() {
    return $('[data-test-eholdings-custom-coverage-add-button] button');
  },

  get $customCoverageEditButton() {
    return $('[data-test-eholdings-custom-coverage-edit-button] button');
  },

  get $customCoverageInputs() {
    return $('[data-test-eholdings-custom-coverage-inputs]');
  },

  get $beginCoverageField() {
    return $('[data-test-eholdings-custom-coverage-begin-coverage] input');
  },

  get $endCoverageField() {
    return $('[data-test-eholdings-custom-coverage-end-coverage] input');
  },

  get $customCoverageClearButton() {
    return $('[data-test-eholdings-custom-coverage-clear-button] button');
  },

  get $customCoverageCancelButton() {
    return $('[data-test-eholdings-custom-coverage-cancel-button] button');
  },

  get $customCoverageSaveButton() {
    return $('[data-test-eholdings-custom-coverage-save-button] button');
  },

  get beginCoverageFieldIsInvalid() {
    return this.$beginCoverageField.attr('class').indexOf('feedbackError--') !== -1;
  },

  get endCoverageFieldIsInvalid() {
    return this.$endCoverageField.attr('class').indexOf('feedbackError--') !== -1;
  },

  fillInCustomCoverage({ beginCoverage, endCoverage }) {
    return Promise.all([
      fillIn(this.$beginCoverageField, beginCoverage),
      fillIn(this.$endCoverageField, endCoverage)
    ]);
  },

  clickCustomCoverageAddButton() {
    return convergeOn(() => {
      expect(this.$customCoverageAddButton).to.exist;
    }).then(() => (
      this.$customCoverageAddButton.click()
    ));
  },

  clickCustomCoverageEditButton() {
    return convergeOn(() => {
      expect(this.$customCoverageEditButton).to.exist;
    }).then(() => (
      this.$customCoverageEditButton.click()
    ));
  },

  clickCustomCoverageClearButton() {
    return convergeOn(() => {
      expect(this.$customCoverageClearButton).to.exist;
    }).then(() => (
      this.$customCoverageClearButton.click()
    ));
  },

  clickCustomCoverageCancelButton() {
    return convergeOn(() => {
      expect(this.$customCoverageCancelButton).to.exist;
    }).then(() => (
      this.$customCoverageCancelButton.click()
    ));
  },

  clickCustomCoverageSaveButton() {
    return convergeOn(() => {
      expect(this.$customCoverageSaveButton).to.exist;
    }).then(() => {
      return this.$customCoverageSaveButton.click();
    });
  }
};

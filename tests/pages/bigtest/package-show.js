import {
  clickable,
  collection,
  isPresent,
  page,
  property,
  text,
  value,
  fillable,
  triggerable,
  blurrable,
  action
} from '@bigtest/interaction';

@page class PackageShowModal {
  confirmDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-yes]');
  cancelDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-no]');
}

@page class PackageDatePicker {
  hasBeginDateField = isPresent('[data-test-eholdings-custom-coverage-date-range-begin] input')
  hasEndDateField = isPresent('[data-test-eholdings-custom-coverage-date-range-end] input')

  beginDateValue = value('[data-test-eholdings-custom-coverage-date-range-begin] input')
  endDateValue = value('[data-test-eholdings-custom-coverage-date-range-end] input')

  fillBeginDate = fillable('[data-test-eholdings-custom-coverage-date-range-begin] input')
  fillEndDate = fillable('[data-test-eholdings-custom-coverage-date-range-end] input')

  clickBeginDateField = clickable('[data-test-eholdings-custom-coverage-date-range-begin] input')
  clickEndDateField = clickable('[data-test-eholdings-custom-coverage-date-range-end] input')

  pressEnterBeginDate = triggerable('keydown', '[data-test-eholdings-custom-coverage-date-range-begin] input', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  })
  pressEnterEndDate = triggerable('keydown', '[data-test-eholdings-custom-coverage-date-range-end] input', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  })

  clearBeginDate = clickable('[data-test-eholdings-custom-coverage-date-range-begin] button[id^=datepicker-clear-button]')
  clearEndDate = clickable('[data-test-eholdings-custom-coverage-date-range-end] button[id^=datepicker-clear-button]')

  blurBeginDate = blurrable('[data-test-eholdings-custom-coverage-date-range-begin] input')
  blurEndDate = blurrable('[data-test-eholdings-custom-coverage-date-range-end] input')

  fillBeginDateField = action(function(date) {
    return this.clickBeginDateField()
      .fillBeginDate(date)
      .pressEnterBeginDate()
      .blurBeginDate();
  });

  fillEndDateField = action(function(date) {
    return this.clickEndDateField()
      .fillEndDate(date)
      .pressEnterEndDate()
      .blurEndDate();
  });

  enterAndClearBeginDate(date) {
    return this.fillBeginDateField(date)
      .clearBeginDate()
      .blurBeginDate();
  }

  enterBeginDateAfterEndDate(beginDate, endDate) {
    return this.fillBeginDateField(beginDate)
      .fillEndDateField(endDate);
  }
}

@page class PackageShowPage {
  allowKbToAddTitles = property('checked', '[data-test-eholdings-package-details-allow-add-new-titles] input');
  hasAllowKbToAddTitles = isPresent('[data-test-eholdings-package-details-toggle-allow-add-new-titles] input');
  hasAllowKbToAddTitlesToggle = isPresent('[package-details-toggle-allow-add-new-titles-switch]');
  isSelected = property('checked', '[data-test-eholdings-package-details-selected] input');
  modal = new PackageShowModal('#eholdings-package-confirmation-modal');
  toggleAllowKbToAddTitles = clickable('[data-test-eholdings-package-details-allow-add-new-titles] input');
  toggleIsSelected = clickable('[data-test-eholdings-package-details-selected] input');
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  name = text('[data-test-eholdings-details-view-name="package"]');
  contentType = text('[data-test-eholdings-package-details-content-type]');
  numTitles = text('[data-test-eholdings-package-details-titles-total]');
  numTitlesSelected = text('[data-test-eholdings-package-details-titles-selected]');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="package"]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button] button');

  titleList = collection('[data-test-query-list="package-titles"] li a', {
    name: text('[data-test-eholdings-title-list-item-title-name]'),
    selectedLabel: text('[data-test-eholdings-title-list-item-title-selected]')
  });

  hasCustomCoverage = isPresent('[data-test-eholdings-package-details-custom-coverage-display]')
  customCoverage = text('[data-test-eholdings-package-details-custom-coverage-display]')
  hasCustomCoverageAddButton = isPresent('[data-test-eholdings-package-details-custom-coverage-button] button')
  clickCustomCoverageAddButton = clickable('[data-test-eholdings-package-details-custom-coverage-button] button')
  clickCustomCoverageCancelButton = clickable('[data-test-eholdings-package-details-cancel-custom-coverage-button] button')
  clickCustomCoverageEditButton = clickable('[data-test-eholdings-package-details-edit-custom-coverage-button] button')
  clickCustomCoverageSaveButton = clickable('[data-test-eholdings-package-details-save-custom-coverage-button] button')
  isCustomCoverageDisabled = property('disabled', '[data-test-eholdings-package-details-save-custom-coverage-button] button')
  validationError = text('[data-test-eholdings-custom-coverage-date-range-begin] [class^="feedbackError"]')

  dateFields = new PackageDatePicker()

  deselectAndConfirmPackage() {
    return this.toggleIsSelected().append(this.modal.confirmDeselection());
  }

  deselectAndCancelPackage() {
    return this.toggleIsSelected().append(this.modal.cancelDeselection());
  }
}

export default new PackageShowPage('[data-test-eholdings-details-view="package"]');

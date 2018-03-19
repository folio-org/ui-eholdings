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
  blurrable
} from '@bigtest/interaction';
import { isRootPresent } from '../helpers';

@page class PackageShowModal {
  confirmDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-yes]');
  cancelDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-no]');
}

@page class Datepicker {
  exists = isRootPresent();
  value = value('input');
  clickInput = clickable('input');
  fillInput = fillable('input');
  blurInput = blurrable('input');
  clearInput = clickable('button[id^=datepicker-clear-button]');
  pressEnter = triggerable('keydown', 'input', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  });

  fillAndBlur(date) {
    return this
      .clickInput()
      .fillInput(date)
      .pressEnter()
      .blurInput();
  }

  fillAndClear(date) {
    return this
      .fillAndBlur(date)
      .clearInput()
      .blurInput();
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

  beginDate = new Datepicker('[data-test-eholdings-custom-coverage-date-range-begin]');
  endDate = new Datepicker('[data-test-eholdings-custom-coverage-date-range-end]');

  fillDates(beginDate, endDate) {
    return this.beginDate.fillAndBlur(beginDate)
      .append(this.endDate.fillAndBlur(endDate));
  }

  deselectAndConfirmPackage() {
    return this.toggleIsSelected().append(this.modal.confirmDeselection());
  }

  deselectAndCancelPackage() {
    return this.toggleIsSelected().append(this.modal.cancelDeselection());
  }
}

export default new PackageShowPage('[data-test-eholdings-details-view="package"]');

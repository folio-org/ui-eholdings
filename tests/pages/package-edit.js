import {
  clickable,
  collection,
  isPresent,
  page,
  property
} from '@bigtest/interaction';
import Datepicker from './datepicker';

@page class PackageEditNavigationModal {}

@page class PackageEditPage {
  navigationModal = new PackageEditNavigationModal('#navigation-modal');

  clickCancel = clickable('[data-test-eholdings-package-cancel-button] button');
  clickSave = clickable('[data-test-eholdings-package-save-button] button');
  isSaveDisabled = property('disabled', '[data-test-eholdings-package-save-button] button');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="package"]');

  dateRangeRowList = collection('[data-test-eholdings-coverage-fields-date-range-row]', {
    beginDate: new Datepicker('[data-test-eholdings-coverage-fields-date-range-begin]'),
    endDate: new Datepicker('[data-test-eholdings-coverage-fields-date-range-end]'),
    clickRemoveRowButton: clickable('[data-test-eholdings-coverage-fields-remove-row-button] button'),
    fillDates(beginDate, endDate) {
      return this.beginDate.fillAndBlur(beginDate)
        .append(this.endDate.fillAndBlur(endDate));
    }
  });
}

export default new PackageEditPage('[data-test-eholdings-details-view="package"]');

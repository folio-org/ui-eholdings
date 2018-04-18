import {
  page,
  isPresent,
  fillable,
  clickable,
  collection
} from '@bigtest/interaction';
import Datepicker from './datepicker';

@page class PackageCreatePage {
  hasName = isPresent('[data-test-eholdings-package-name-field]');
  fillName = fillable('[data-test-eholdings-package-name-field] input');
  hasContentType = isPresent('[data-test-eholdings-package-content-type-field]');
  chooseContentType = fillable('[data-test-eholdings-package-content-type-field] select');
  hasAddCoverageButton = isPresent('[data-test-eholdings-coverage-fields-add-row-button]');
  addCoverage = clickable('[data-test-eholdings-coverage-fields-add-row-button] button');
  save = clickable('[data-test-eholdings-package-create-save-button] button');
  cancel = clickable('[data-test-eholdings-package-create-cancel-button] button');

  dateRangeRowList = collection('[data-test-eholdings-coverage-fields-date-range-row]', {
    beginDate: new Datepicker('[data-test-eholdings-coverage-fields-date-range-begin]'),
    endDate: new Datepicker('[data-test-eholdings-coverage-fields-date-range-end]'),
    fillDates(beginDate, endDate) {
      return this.beginDate.fillAndBlur(beginDate)
        .append(this.endDate.fillAndBlur(endDate));
    }
  });
}

export default new PackageCreatePage('[data-test-eholdings-package-create]');

import {
  interactor,
  isPresent,
  fillable,
  clickable,
  collection,
  scoped,
  property
} from '@bigtest/interactor';
import Datepicker from './datepicker';

@interactor class PackageCreatePage {
  hasName = isPresent('[data-test-eholdings-package-name-field]');
  fillName = fillable('[data-test-eholdings-package-name-field] input');
  hasContentType = isPresent('[data-test-eholdings-package-content-type-field]');
  chooseContentType = fillable('[data-test-eholdings-package-content-type-field] select');
  hasAddCoverageButton = isPresent('[data-test-eholdings-coverage-fields-add-row-button]');
  addCoverage = clickable('[data-test-eholdings-coverage-fields-add-row-button] button');
  save = clickable('[data-test-eholdings-package-create-save-button] button');
  cancel = clickable('[data-test-eholdings-package-create-cancel-button] button');
  isSaveDisabled = property('[data-test-eholdings-package-create-save-button] button', 'disabled');
  isCancelDisabled = property('[data-test-eholdings-package-create-cancel-button] button', 'disabled');

  dateRangeRowList = collection('[data-test-eholdings-coverage-fields-date-range-row]', {
    beginDate: scoped('[data-test-eholdings-coverage-fields-date-range-begin]', Datepicker),
    endDate: scoped('[data-test-eholdings-coverage-fields-date-range-end]', Datepicker),
    fillDates(beginDate, endDate) {
      return this.beginDate.fillAndBlur(beginDate)
        .endDate.fillAndBlur(endDate);
    }
  });
}

export default new PackageCreatePage('[data-test-eholdings-package-create]');

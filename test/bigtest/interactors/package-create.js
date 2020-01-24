import {
  interactor,
  isPresent,
  fillable,
  clickable,
  collection,
  scoped,
  property,
  value
} from '@bigtest/interactor';
import Datepicker from './datepicker';

@interactor class PackageCreatePage {
  hasName = isPresent('[data-test-eholdings-package-name-field]');
  fillName = fillable('[data-test-eholdings-package-name-field] input');
  hasContentType = isPresent('[data-test-eholdings-package-content-type-field]');
  chooseContentType = fillable('[data-test-eholdings-package-content-type-field] select');
  contentTypeValue = value('[data-test-eholdings-package-content-type-field] select');
  hasAddCoverageButton = isPresent('[data-test-eholdings-package-coverage-fields] [data-test-repeatable-field-add-item-button]');
  addCoverage = clickable('[data-test-eholdings-package-coverage-fields] [data-test-repeatable-field-add-item-button]');
  save = clickable('[data-test-eholdings-package-create-save-button]');
  isSaveDisabled = property('[data-test-eholdings-package-create-save-button]', 'disabled');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  clickBackButton = clickable('[data-test-eholdings-details-view-back-button]');

  dateRangeRowList = collection('[data-test-eholdings-package-coverage-fields] li', {
    beginDate: scoped('[data-test-eholdings-coverage-fields-date-range-begin]', Datepicker),
    endDate: scoped('[data-test-eholdings-coverage-fields-date-range-end]', Datepicker),
    fillDates(beginDate, endDate) {
      return this.beginDate.fillAndBlur(beginDate)
        .endDate.fillAndBlur(endDate);
    }
  });

  cancelEditing = clickable('[data-test-eholdings-package-create-cancel-button]');
}

export default new PackageCreatePage('[data-test-eholdings-package-create]');

import {
  action,
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

@interactor class PackageCreateDropDown {
  clickDropDownButton = clickable('button');
}

@interactor class PackageCreateDropDownMenu {
  clickCancel = clickable('.tether-element [data-test-eholdings-package-create-cancel-action]');
}

@interactor class PackageCreatePage {
  hasName = isPresent('[data-test-eholdings-package-name-field]');
  fillName = fillable('[data-test-eholdings-package-name-field] input');
  hasContentType = isPresent('[data-test-eholdings-package-content-type-field]');
  chooseContentType = fillable('[data-test-eholdings-package-content-type-field] select');
  contentTypeValue = value('[data-test-eholdings-package-content-type-field] select');
  hasAddCoverageButton = isPresent('[data-test-eholdings-coverage-fields-add-row-button]');
  addCoverage = clickable('[data-test-eholdings-coverage-fields-add-row-button] button');
  save = clickable('[data-test-eholdings-package-create-save-button]');
  isSaveDisabled = property('[data-test-eholdings-package-create-save-button]', 'disabled');

  dateRangeRowList = collection('[data-test-eholdings-coverage-fields-date-range-row]', {
    beginDate: scoped('[data-test-eholdings-coverage-fields-date-range-begin]', Datepicker),
    endDate: scoped('[data-test-eholdings-coverage-fields-date-range-end]', Datepicker),
    fillDates(beginDate, endDate) {
      return this.beginDate.fillAndBlur(beginDate)
        .endDate.fillAndBlur(endDate);
    }
  });

  dropDown = new PackageCreateDropDown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  dropDownMenu = new PackageCreateDropDownMenu();
  cancel= action(function () {
    return this
      .dropDown.clickDropDownButton()
      .dropDownMenu.clickCancel();
  });
}

export default new PackageCreatePage('[data-test-eholdings-package-create]');

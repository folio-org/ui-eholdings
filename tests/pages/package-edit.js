import {
  clickable,
  collection,
  fillable,
  isPresent,
  page,
  property,
} from '@bigtest/interaction';
import { hasClassBeginningWith, isRootPresent } from './helpers';
import Toast from './toast';
import Datepicker from './datepicker';

@page class PackageEditNavigationModal {}

@page class PackageEditModal {
  exists = isRootPresent();
  cancelDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-no]');
  confirmDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-yes]');
}

@page class PackageEditPage {
  navigationModal = new PackageEditNavigationModal('#navigation-modal');

  clickCancel = clickable('[data-test-eholdings-package-cancel-button] button');
  clickSave = clickable('[data-test-eholdings-package-save-button] button');
  isSaveDisabled = property('disabled', '[data-test-eholdings-package-save-button] button');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="package"]');
  toggleIsSelected = clickable('[data-test-eholdings-custom-package-details-selected] input');
  isSelected = property('checked', '[data-test-eholdings-custom-package-details-selected] input');
  modal = new PackageEditModal('#eholdings-custom-package-confirmation-modal');

  toast = Toast;

  name = fillable('[data-test-eholdings-package-name-field] input');
  contentType = fillable('[data-test-eholdings-package-content-type-field] select');
  nameHasError = hasClassBeginningWith('feedbackError--', '[data-test-eholdings-package-name-field] input');

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

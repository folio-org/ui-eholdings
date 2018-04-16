import {
  clickable,
  collection,
  isPresent,
  page,
  property,
  text,
} from '@bigtest/interaction';
import { isRootPresent } from './helpers';
import Datepicker from './datepicker';

@page class ResourceCustomCoveragePage {
  exists = isRootPresent();
  clickAddButton = clickable('[data-test-eholdings-coverage-form-add-button] button');
  hasForm = isPresent('[data-test-eholdings-coverage-form] form');
  clickCancelButton = clickable('[data-test-eholdings-inline-form-cancel-button] button');
  clickSaveButton = clickable('[data-test-eholdings-inline-form-save-button] button');
  clickEditButton = clickable('[data-test-eholdings-coverage-form-edit-button] button')
  hasCancelButton = isPresent('[data-test-eholdings-inline-form-cancel-button] button');
  isSaveButtonDisabled = property('disabled', '[data-test-eholdings-inline-form-save-button] button');
  hasSaveButton = isPresent('[data-test-eholdings-inline-form-save-button] button');
  hasAddButton = isPresent('[data-test-eholdings-coverage-form-add-button] button');
  hasEditButton = isPresent('[data-test-eholdings-coverage-form-edit-button]');
  clickAddRowButton = clickable('[data-test-eholdings-coverage-fields-add-row-button] button');
  displayText = text('[data-test-eholdings-coverage-form-display]');
  hasSavingWillRemoveMessage = isPresent('[data-test-eholdings-coverage-fields-saving-will-remove]');

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

export default new ResourceCustomCoveragePage('[data-test-eholdings-coverage-form]');

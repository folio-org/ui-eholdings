import {
  clickable,
  collection,
  fillable,
  isPresent,
  interactor,
  property,
  text,
} from '@bigtest/interactor';
import { hasClassBeginningWith } from './helpers';
import Toast from './toast';
import Datepicker from './datepicker';

@interactor class PackageEditNavigationModal {
  cancelNavigation = clickable('[data-test-navigation-modal-dismiss]');
  confirmNavigation = clickable('[data-test-navigation-modal-continue]');
}

@interactor class PackageEditModal {
  cancelDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-no]');
  confirmDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-yes]');
}

@interactor class PackageEditPage {
  navigationModal = new PackageEditNavigationModal('#navigation-modal');

  clickCancel = clickable('[data-test-eholdings-package-cancel-button] button');
  clickSave = clickable('[data-test-eholdings-package-save-button] button');
  isSaveDisabled = property('[data-test-eholdings-package-save-button] button', 'disabled');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="package"]');
  toggleIsSelected = clickable('[data-test-eholdings-package-details-selected] input');
  isSelected = property('[data-test-eholdings-package-details-selected] input', 'checked');
  modal = new PackageEditModal('#eholdings-package-confirmation-modal');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button] button');
  toggleIsVisible = clickable('[data-test-eholdings-package-details-visible] input');
  isVisibleToPatrons = property('[data-test-eholdings-package-details-visible] input', 'checked');
  isHiddenMessage = text('[data-test-eholdings-package-details-is-hidden-reason]');
  isHiddenMessagePresent = isPresent('[data-test-eholdings-package-details-is-hidden-reason]');
  isVisibleTogglePresent = isPresent('[data-test-eholdings-package-details-visible] input');
  hasRadioForAllowKbToAddTitles = isPresent('[data-test-eholdings-allow-kb-to-add-titles-radios]');
  toggleAllowKbToAddTitles = clickable('[data-test-eholdings-package-details-allow-add-new-titles] input');
  allowKbToAddTitles = property('[data-test-eholdings-package-details-allow-add-new-titles] input', 'checked');
  disallowKbToAddTitlesRadio = property('[data-test-eholdings-allow-kb-to-add-titles-radio-no]', 'checked')
  allowKbToAddTitlesRadio = property('[data-test-eholdings-allow-kb-to-add-titles-radio-yes]', 'checked');
  clickAllowKbToAddTitlesRadio = clickable('[data-test-eholdings-allow-kb-to-add-titles-radio-yes]');
  clickDisallowKbToAddTitlesRadio = clickable('[data-test-eholdings-allow-kb-to-add-titles-radio-no]');
  hasCoverageDatesPresent = isPresent('[data-test-eholdings-coverage-fields-date-range-row]');
  hasNameFieldPresent = isPresent('[data-test-eholdings-package-name-field]');
  hasReadOnlyNameFieldPresent = isPresent('[data-test-eholdings-package-readonly-name-field]');
  hasContentTypeFieldPresent = isPresent('[data-test-eholdings-package-content-type-field]');
  hasReadOnlyContentTypeFieldPresent = isPresent('[data-test-eholdings-package-details-readonly-content-type]');

  toast = Toast;

  name = fillable('[data-test-eholdings-package-name-field] input');
  contentType = fillable('[data-test-eholdings-package-content-type-field] select');
  nameHasError = hasClassBeginningWith('[data-test-eholdings-package-name-field] input', 'feedbackError--');

  dateRangeRowList = collection('[data-test-eholdings-coverage-fields-date-range-row]', {
    beginDate: new Datepicker('[data-test-eholdings-coverage-fields-date-range-begin]'),
    endDate: new Datepicker('[data-test-eholdings-coverage-fields-date-range-end]'),
    clickRemoveRowButton: clickable('[data-test-eholdings-coverage-fields-remove-row-button] button'),
    fillDates(beginDate, endDate) {
      return this.beginDate.fillAndBlur(beginDate)
        .endDate.fillAndBlur(endDate);
    }
  });
}

export default new PackageEditPage('[data-test-eholdings-details-view="package"]');

import {
  action,
  clickable,
  collection,
  computed,
  scoped,
  fillable,
  blurrable,
  isPresent,
  interactor,
  property,
  text,
  value,
  selectable,
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import { hasClassBeginningWith } from './helpers';
import Toast from './toast';
import Datepicker from './datepicker';
import PackageSelectionStatus from './selection-status';
import NavigationModal from './navigation-modal';
import PackageModal from './package-modal';
import ActionsDropDown from './actions-drop-down';
import PackageDropDownMenu from './package-drop-down-menu';
import SectionToggleButton from './section-toggle-button';

@interactor class PackageEditPage {
  isLoaded = isPresent('[data-test-eholdings-details-view-pane-title]');
  whenLoaded() {
    return this.when(() => this.isLoaded).timeout(1000);
  }

  navigationModal = NavigationModal;

  clickCancelEditing = clickable('[data-test-eholdings-package-edit-cancel-button]');

  clickSave = clickable('[data-test-eholdings-package-save-button]');
  isSavePresent = isPresent('[data-test-eholdings-package-save-button]');
  isSaveDisabled = property('[data-test-eholdings-package-save-button]', 'disabled');
  hasErrors = isPresent('[data-test-eholdings-package-edit-error]');
  modal = new PackageModal('#eholdings-package-confirmation-modal');
  selectionStatus = new PackageSelectionStatus();
  clickAddButton = clickable('[data-test-eholdings-package-add-to-holdings-button]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  clickBackButton = clickable('[data-test-eholdings-details-view-back-button]');
  isHiddenMessage = text('[data-test-eholdings-package-details-is-hidden-reason]');
  isHiddenMessagePresent = isPresent('[data-test-eholdings-package-details-is-hidden-reason]');
  isVisibilityFieldPresent = isPresent('[data-test-eholdings-package-visibility-field]');
  isVisibleToPatrons = property('[data-test-eholdings-package-visibility-field] input[value="true"]', 'checked');
  hasAccessTypeSelect = isPresent('[data-test-eholdings-access-type-select-field] select');
  accessTypeSelectValue = value('[data-test-eholdings-access-type-select-field] select');
  chooseAccessType = selectable('[data-test-eholdings-access-type-select-field] select');

  toggleIsVisible() {
    const isVisible = (!this.isVisibleToPatrons).toString();
    return this.click(`[data-test-eholdings-package-visibility-field] input[value="${isVisible}"]`);
  }

  isHiddenMessage = computed(function () {
    const $node = this.$('[data-test-eholdings-package-visibility-field] input[value="false"] ~ span:last-child');
    return $node.textContent.replace(/^No(\s\((.*)\))?$/, '$2');
  });

  isHiddenMessagePresent = computed(function () {
    try { return !!this.isHiddenMessage; } catch (e) { return false; }
  });

  hasRadioForAllowKbToAddTitles = isPresent('[data-test-eholdings-allow-kb-to-add-titles-radios]');
  disallowKbToAddTitlesRadio = property('[data-test-eholdings-allow-kb-to-add-titles-radio-no]', 'checked')
  allowKbToAddTitlesRadio = property('[data-test-eholdings-allow-kb-to-add-titles-radio-yes]', 'checked');
  clickAllowKbToAddTitlesRadio = clickable('[data-test-eholdings-allow-kb-to-add-titles-radio-yes]');
  clickDisallowKbToAddTitlesRadio = clickable('[data-test-eholdings-allow-kb-to-add-titles-radio-no]');
  hasCoverageDatesPresent = isPresent('[data-test-eholdings-package-coverage-fields] li');
  hasNameFieldPresent = isPresent('[data-test-eholdings-package-name-field]');
  hasReadOnlyNameFieldPresent = isPresent('[data-test-eholdings-package-readonly-name-field]');
  hasContentTypeFieldPresent = isPresent('[data-test-eholdings-package-content-type-field]');
  hasReadOnlyContentTypeFieldPresent = isPresent('[data-test-eholdings-package-details-readonly-content-type]');
  proxySelectValue = value('[data-test-eholdings-package-proxy-select-field] select');
  chooseProxy = selectable('[data-test-eholdings-package-proxy-select-field] select');
  actionsDropDown = ActionsDropDown;
  dropDownMenu = new PackageDropDownMenu();
  sectionToggleButton = new SectionToggleButton();
  holdingStatusSectionAccordion = new AccordionInteractor('#packageHoldingStatus');
  settingsSectionAccordion = new AccordionInteractor('#packageSettings');
  coverageSettingsSectionAccordion = new AccordionInteractor('#packageCoverageSettings');
  hasProviderTokenHelpText = isPresent('[data-test-eholdings-token-fields-help-text="provider"]');
  providerTokenHelpText = text('[data-test-eholdings-token-fields-help-text="provider"]');
  hasProviderTokenPrompt = isPresent('[data-test-eholdings-token-fields-prompt="provider"]');
  providerTokenPrompt = text('[data-test-eholdings-token-fields-prompt="provider"]');
  hasProviderTokenValue = isPresent('[data-test-eholdings-token-value-textarea="provider"]');
  providerTokenValue = text('[data-test-eholdings-token-value-textarea="provider"]');
  hasAddProviderTokenBtn = isPresent('[data-test-eholdings-token-add-button="provider"]');
  clickAddProviderTokenButton = clickable('[data-test-eholdings-token-add-button="provider"] button');
  fillProviderTokenValue = fillable('[data-test-eholdings-token-value-textarea="provider"] textarea');
  blurProviderTokenValue = blurrable('[data-test-eholdings-token-value-textarea="provider"] textarea');
  hasPackageTokenHelpText = isPresent('[data-test-eholdings-token-fields-help-text="package"]');
  packageTokenHelpText = text('[data-test-eholdings-token-fields-help-text="package"]');
  hasPackageTokenPrompt = isPresent('[data-test-eholdings-token-fields-prompt="package"]');
  packageTokenPrompt = text('[data-test-eholdings-token-fields-prompt="package"]');
  hasPackageTokenValue = isPresent('[data-test-eholdings-token-value-textarea="package"]');
  packageTokenValue = text('[data-test-eholdings-token-value-textarea="package"]');
  hasAddPackageTokenBtn = isPresent('[data-test-eholdings-token-add-button="package"]');
  clickAddPackageTokenButton = clickable('[data-test-eholdings-token-add-button="package"] button');
  fillPackageTokenValue = fillable('[data-test-eholdings-token-value-textarea="package"] textarea');
  blurPackageTokenValue = blurrable('[data-test-eholdings-token-value-textarea="package"] textarea');

  inputProviderTokenValue = action(function (tokenValue) {
    return this
      .fillProviderTokenValue(tokenValue)
      .blurProviderTokenValue();
  });

  inputPackageTokenValue = action(function (tokenValue) {
    return this
      .fillPackageTokenValue(tokenValue)
      .blurPackageTokenValue();
  });

  providerTokenHasError = hasClassBeginningWith('[data-test-eholdings-token-value-textarea="provider"] textarea', 'hasError--');
  providerTokenError = text('[data-test-eholdings-token-value-textarea="provider"] [class^="feedbackError--"]');
  packageTokenHasError = hasClassBeginningWith('[data-test-eholdings-token-value-textarea="package"] textarea', 'hasError--');
  packageTokenError = text('[data-test-eholdings-token-value-textarea="package"] [class^="feedbackError--"]');

  toast = Toast;

  selectPackage() {
    return this
      .actionsDropDown.clickDropDownButton()
      .dropDownMenu.addToHoldings.click();
  }

  deselectAndConfirmPackage() {
    return this
      .actionsDropDown.clickDropDownButton()
      .dropDownMenu.removeFromHoldings.click()
      .modal.confirmDeselection();
  }

  deselectAndCancelPackage() {
    return this
      .actionsDropDown.clickDropDownButton()
      .dropDownMenu.removeFromHoldings.click()
      .modal.cancelDeselection();
  }

  name = fillable('[data-test-eholdings-package-name-field] input');
  contentType = fillable('[data-test-eholdings-package-content-type-field] select');
  nameHasError = hasClassBeginningWith('[data-test-eholdings-package-name-field] [class*=inputGroup--]', 'hasError--');

  dateRangeRowList = collection('[data-test-eholdings-package-coverage-fields] li', {
    beginDate: scoped('[data-test-eholdings-coverage-fields-date-range-begin]', Datepicker),
    endDate: scoped('[data-test-eholdings-coverage-fields-date-range-end]', Datepicker),
    clickRemoveRowButton: clickable('[data-test-repeatable-field-add-item-button]'),
    fillDates(beginDate, endDate) {
      return this.beginDate.fillAndBlur(beginDate)
        .endDate.fillAndBlur(endDate);
    }
  });
}

export default new PackageEditPage();

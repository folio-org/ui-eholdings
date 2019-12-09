import {
  Interactor,
  action,
  attribute,
  clickable,
  collection,
  computed,
  scoped,
  fillable,
  focusable,
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

@interactor class PackageEditNavigationModal {
  cancelNavigation = clickable('[data-test-navigation-modal-dismiss]');
  confirmNavigation = clickable('[data-test-navigation-modal-continue]');
}

@interactor class PackageEditModal {
  cancelDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-no]');
  confirmDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-yes]');
  confirmButtonText = text('[data-test-eholdings-package-deselection-confirmation-modal-yes]');
  confirmButtonIsDisabled = property('[data-test-eholdings-package-deselection-confirmation-modal-yes]', 'disabled');
}

@interactor class PackageEditDropDown {
  clickDropDownButton = clickable('button');
  isExpanded = attribute('button', 'aria-expanded');
}

@interactor class PackageEditDropDownMenu {
  addToHoldings = new Interactor('.tether-element [data-test-eholdings-package-add-to-holdings-action]');
  removeFromHoldings = new Interactor('.tether-element [data-test-eholdings-package-remove-from-holdings-action]');
  cancel = new Interactor('.tether-element [data-test-eholdings-package-cancel-action]');
}

@interactor class SectionToggleButton {
  exists = isPresent('[data-test-eholdings-details-view-collapse-all-button]]');
  label = text('[data-test-eholdings-details-view-collapse-all-button]]');
  click = clickable('[data-test-eholdings-details-view-collapse-all-button] button');
}

@interactor class PackageEditPage {
  isLoaded = isPresent('[data-test-eholdings-details-view-pane-title]');
  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  navigationModal = new PackageEditNavigationModal('#navigation-modal');

  clickCancel= action(function () {
    return this
      .dropDown.clickDropDownButton()
      .dropDownMenu.cancel.click();
  });

  clickSave = clickable('[data-test-eholdings-package-save-button]');
  isSavePresent = isPresent('[data-test-eholdings-package-save-button]');
  isSaveDisabled = property('[data-test-eholdings-package-save-button]', 'disabled');
  hasErrors = isPresent('[data-test-eholdings-package-edit-error]');
  modal = new PackageEditModal('#eholdings-package-confirmation-modal');
  selectionStatus = new PackageSelectionStatus();
  clickAddButton = clickable('[data-test-eholdings-package-add-to-holdings-button]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  isHiddenMessage = text('[data-test-eholdings-package-details-is-hidden-reason]');
  isHiddenMessagePresent = isPresent('[data-test-eholdings-package-details-is-hidden-reason]');
  isVisibilityFieldPresent = isPresent('[data-test-eholdings-package-visibility-field]');
  isVisibleToPatrons = property('[data-test-eholdings-package-visibility-field] input[value="true"]', 'checked');
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
  dropDown = new PackageEditDropDown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  dropDownMenu = new PackageEditDropDownMenu();
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
  focusProviderTokenValue = focusable('[data-test-eholdings-token-value-textarea="provider"] textarea');
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
  focusPackageTokenValue = focusable('[data-test-eholdings-token-value-textarea="package"] textarea');
  blurPackageTokenValue = blurrable('[data-test-eholdings-token-value-textarea="package"] textarea');

  inputProviderTokenValue = action(async function (tokenValue) {
    await this
      .focusProviderTokenValue()
      .fillProviderTokenValue(tokenValue)
      .blurProviderTokenValue();

    return this;
  });

  inputPackageTokenValue = action(async function (tokenValue) {
    await this
      .focusPackageTokenValue()
      .fillPackageTokenValue(tokenValue)
      .blurPackageTokenValue();

    return this;
  });

  providerTokenHasError = hasClassBeginningWith('[data-test-eholdings-token-value-textarea="provider"] textarea', 'hasError--');
  providerTokenError = text('[data-test-eholdings-token-value-textarea="provider"] [class^="feedbackError--"]');
  packageTokenHasError = hasClassBeginningWith('[data-test-eholdings-token-value-textarea="package"] textarea', 'hasError--');
  packageTokenError = text('[data-test-eholdings-token-value-textarea="package"] [class^="feedbackError--"]');

  toast = Toast;

  selectPackage() {
    return this
      .dropDown.clickDropDownButton()
      .dropDownMenu.addToHoldings.click();
  }

  deselectAndConfirmPackage() {
    return this
      .dropDown.clickDropDownButton()
      .dropDownMenu.removeFromHoldings.click()
      .modal.confirmDeselection();
  }

  deselectAndCancelPackage() {
    return this
      .dropDown.clickDropDownButton()
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
    async fillDates(beginDate, endDate) {
      await this.beginDate.fillAndBlur(beginDate);
      await this.endDate.fillAndBlur(endDate);

      return this;
    }
  });
}

export default new PackageEditPage();

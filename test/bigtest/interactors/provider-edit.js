import {
  Interactor,
  interactor,
  clickable,
  property,
  value,
  fillable,
  focusable,
  blurrable,
  text,
  is,
  attribute,
  action,
  isPresent,
  selectable
} from '@bigtest/interactor';
import { hasClassBeginningWith } from './helpers';
import Toast from './toast';

@interactor class ProviderEditNavigationModal {
  cancelNavigation = clickable('[data-test-navigation-modal-dismiss]');
  confirmNavigation = clickable('[data-test-navigation-modal-continue]');
}

@interactor class ProviderEditDropDown {
  clickDropDownButton = clickable('button');
  isExpanded = attribute('button', 'aria-expanded');
}

@interactor class ProviderEditDropDownMenu {
   cancel = new Interactor('.tether-element [data-test-eholdings-provider-cancel-action]');
}

@interactor class ProviderEditPage {
  navigationModal = new ProviderEditNavigationModal('#navigation-modal');
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  name = text('[data-test-eholdings-details-view-name="provider"]');
  nameHasFocus = is('[data-test-eholdings-details-view-name="provider"]', ':focus');
  clickCancel= action(function () {
    return this
      .dropDown.clickDropDownButton()
      .dropDownMenu.cancel.click();
  });

  clickSave = clickable('[data-test-eholdings-provider-save-button]');
  isSaveDisabled = property('[data-test-eholdings-provider-save-button]', 'disabled');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="provider"]');

  proxySelectValue = value('[data-test-eholdings-provider-proxy-select] select');
  chooseRootProxy = selectable('[data-test-eholdings-provider-proxy-select] select');
  hasProviderTokenHelpText = isPresent('[data-test-eholdings-token-fields-help-text="provider"]');
  providerTokenHelpText = text('[data-test-eholdings-token-fields-help-text="provider"]');
  hasProviderTokenPrompt = isPresent('[data-test-eholdings-token-fields-prompt="provider"]');
  providerTokenPrompt = text('[data-test-eholdings-token-fields-prompt="provider"]');
  hasProviderTokenValue = isPresent('[data-test-eholdings-token-value-textarea="provider"]');
  providerTokenValue = text('[data-test-eholdings-token-value-textarea="provider"]');
  hasAddProviderTokenBtn = isPresent('[data-test-eholdings-token-add-button="provider"]');
  clickAddProviderTokenButton = clickable('[data-test-eholdings-token-add-button="provider"] button');
  focusProviderTokenValue = focusable('[data-test-eholdings-token-value-textarea="provider"] textarea');
  fillProviderTokenValue = fillable('[data-test-eholdings-token-value-textarea="provider"] textarea');
  blurProviderTokenValue = blurrable('[data-test-eholdings-token-value-textarea="provider"] textarea');

  inputProviderTokenValue = action(function (tokenValue) {
    return this
      .focusProviderTokenValue()
      .fillProviderTokenValue(tokenValue)
      .blurProviderTokenValue();
  });

  dropDown = new ProviderEditDropDown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  dropDownMenu = new ProviderEditDropDownMenu();
  hasProxySelect = isPresent('[data-test-eholdings-provider-proxy-select] select');
  noPackagesSelected = text('[data-test-eholdings-provider-package-not-selected]');

  providerTokenHasError = hasClassBeginningWith('[data-test-eholdings-token-value-textarea="provider"] textarea', 'hasError--');
  providerTokenError = text('[data-test-eholdings-token-value-textarea="provider"] [class^="feedbackError--"]');

  toast = Toast;
}

export default new ProviderEditPage('[data-test-eholdings-details-view="provider"]');

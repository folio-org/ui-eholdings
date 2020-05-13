import {
  interactor,
  clickable,
  property,
  value,
  fillable,
  blurrable,
  text,
  is,
  action,
  isPresent,
  selectable
} from '@bigtest/interactor';
import { hasClassBeginningWith } from './helpers';
import Toast from './toast';
import NavigationModal from './navigation-modal';

@interactor class ProviderEditPage {
  navigationModal = NavigationModal;
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  name = text('[data-test-eholdings-details-view-name="provider"]');
  nameHasFocus = is('[data-test-eholdings-details-view-name="provider"]', ':focus');
  clickCancelEditing = clickable('[data-test-eholdings-provider-edit-cancel-button]');
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
  fillProviderTokenValue = fillable('[data-test-eholdings-token-value-textarea="provider"] textarea');
  blurProviderTokenValue = blurrable('[data-test-eholdings-token-value-textarea="provider"] textarea');
  clickBackButton = clickable('[data-test-eholdings-details-view-back-button]');

  inputProviderTokenValue = action(function (tokenValue) {
    return this
      .fillProviderTokenValue(tokenValue)
      .blurProviderTokenValue();
  });

  hasProxySelect = isPresent('[data-test-eholdings-provider-proxy-select] select');
  noPackagesSelected = text('[data-test-eholdings-provider-package-not-selected]');

  providerTokenHasError = hasClassBeginningWith('[data-test-eholdings-token-value-textarea="provider"] textarea', 'hasError--');
  providerTokenError = text('[data-test-eholdings-token-value-textarea="provider"] [class^="feedbackError--"]');

  toast = Toast;
}

export default new ProviderEditPage('[data-test-eholdings-details-view="provider"]');

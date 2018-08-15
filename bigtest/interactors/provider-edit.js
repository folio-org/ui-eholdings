import {
  Interactor,
  interactor,
  clickable,
  property,
  value,
  fillable,
  text,
  is,
  attribute,
  action,
  isPresent
} from '@bigtest/interactor';

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

  ProxySelectValue = value('[data-test-eholdings-provider-proxy-select] select');
  chooseRootProxy = fillable('[data-test-eholdings-provider-proxy-select] select');
  dropDown = new ProviderEditDropDown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  dropDownMenu = new ProviderEditDropDownMenu();

  toast = Toast;
}

export default new ProviderEditPage('[data-test-eholdings-details-view="provider"]');

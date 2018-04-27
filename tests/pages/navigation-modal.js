import {
  interactor,
  isVisible,
  clickable
} from '@bigtest/interactor';

@interactor class NavigationModal {
  isModalVisible = isVisible();
  clickContinue = clickable('[data-test-navigation-modal-continue]');
  clickDismiss = clickable('[data-test-navigation-modal-dismiss]');
}

export default new NavigationModal('#navigation-modal');

import {
  interactor,
  clickable
} from '@bigtest/interactor';

@interactor class NavigationModal {
  clickContinue = clickable('[data-test-navigation-modal-continue]');
  clickDismiss = clickable('[data-test-navigation-modal-dismiss]');
}

export default new NavigationModal('#navigation-modal');

import {
  clickable
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

@interactor class NavigationModal {
  clickContinue = clickable('[data-test-navigation-modal-continue]');
  clickDismiss = clickable('[data-test-navigation-modal-dismiss]');
}

export default new NavigationModal('#navigation-modal');

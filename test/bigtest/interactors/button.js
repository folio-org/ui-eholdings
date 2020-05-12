import {
  is,
  clickable,
  isVisible,
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

export default @interactor class Button {
  isDisabled = is('[disabled]');
  isDisplayed = isVisible();
  click = clickable();
}

import {
  interactor,
  is,
  clickable,
  isVisible,
} from '@bigtest/interactor';

export default @interactor class Button {
  isDisabled = is('[disabled]');
  isDisplayed = isVisible();
  click = clickable();
}

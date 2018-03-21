import {
  clickable,
  page,
  value,
  fillable,
  text,
  triggerable,
  blurrable
} from '@bigtest/interaction';
import { hasClassBeginningWith, isRootPresent } from '../helpers';

export default @page class Datepicker {
  exists = isRootPresent();
  value = value('input');
  clickInput = clickable('input');
  fillInput = fillable('input');
  blurInput = blurrable('input');
  clearInput = clickable('button[id^=datepicker-clear-button]');
  pressEnter = triggerable('keydown', 'input', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  });

  isValid = hasClassBeginningWith('feedbackValid--', 'input');
  isInvalid = hasClassBeginningWith('feedbackError--', 'input');
  validationError = text('div[class^=feedback]');

  fillAndBlur(date) {
    return this
      .clickInput()
      .fillInput(date)
      .pressEnter()
      .blurInput();
  }

  fillAndClear(date) {
    return this
      .fillAndBlur(date)
      .clearInput()
      .blurInput();
  }
}

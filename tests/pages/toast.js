import {
  hasClass,
  count,
  page,
  text
} from '@bigtest/interaction';
import style from '../../src/components/toaster/style.css';

@page class Toast {
  isPositionedTop = hasClass(style.top)
  isPositionedBottom = hasClass(style.bottom)
  errorText = text('[data-test-eholdings-toast="error"]')
  warnText = text('[data-test-eholdings-toast="warn"]')
  successText = text('[data-test-eholdings-toast="success"]')

  totalToastCount = count('[data-test-eholdings-toast]')
  errorToastCount = count('[data-test-eholdings-toast="error"]')
  warnToastCount = count('[data-test-eholdings-toast="warn"]')
  successToastCount = count('[data-test-eholdings-toast="success"]')
}

export default new Toast('[data-test-eholdings-toaster-container]');

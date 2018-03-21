import {
  page,
  text
} from '@bigtest/interaction';

@page class Toast {
  errorText = text('[data-test-eholdings-toast="error"]')
}

export default new Toast('[data-test-eholdings-toaster-container]');

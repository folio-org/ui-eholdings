import $ from 'jquery';

export default {
  get $root() {
    return $('[data-test-eholdings-application]');
  },
  get doesNotHaveBackend() {
    return $('[data-test-eholdings-no-backend]').length > 0;
  },
  get backendNotConfigured() {
    return $('[data-test-eholdings-unconfigured-backend]').length > 0;
  },
  get backendLoadError() {
    return $('[data-test-eholdings-application-rejected]').length > 0;
  }
};

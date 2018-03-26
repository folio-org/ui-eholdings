import {
  isPresent,
  page,
} from '@bigtest/interaction';

@page class ApplicationPage {
  doesNotHaveBackend = isPresent('[data-test-eholdings-no-backend]')
  backendNotConfigured = isPresent('[data-test-eholdings-unconfigured-backend]');
  hasBackendLoadError = isPresent('[data-test-eholdings-application-rejected]');
}

export default new ApplicationPage('[data-test-eholdings-application]');

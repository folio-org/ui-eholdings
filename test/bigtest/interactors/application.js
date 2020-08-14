import {
  isPresent,
  interactor,
} from '@bigtest/interactor';

@interactor class ApplicationPage {
  doesNotHaveBackend = isPresent('[data-test-eholdings-no-backend]')
  backendNotConfigured = isPresent('[data-test-eholdings-unconfigured-backend]');
  hasBackendLoadError = isPresent('[data-test-eholdings-application-rejected]');
  userNotAssignedKbCredentialsError = isPresent('[data-test-eholdings-user-no-credentials]');
  apiLimitExceededError = isPresent('[data-test-eholdings-api-limit-exceeded]');

  whenRequestFailed() {
    return this.when(() => this.hasBackendLoadError).timeout(10000);
  }
}

export default new ApplicationPage();

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
  isPageLoading = isPresent('#kb-credentials-loading-spinner');

  whenLoaded() {
    return this.when(() => !this.isPageLoading);
  }
}

export default new ApplicationPage();

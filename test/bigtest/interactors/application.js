import {
  isPresent,
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

@interactor class ApplicationPage {
  doesNotHaveBackend = isPresent('[data-test-eholdings-no-backend]')
  backendNotConfigured = isPresent('[data-test-eholdings-unconfigured-backend]');
  hasBackendLoadError = isPresent('[data-test-eholdings-application-rejected]');
}

export default new ApplicationPage();

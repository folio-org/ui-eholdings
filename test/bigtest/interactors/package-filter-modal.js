import {
  interactor,
  clickable,
  isPresent,
} from '@bigtest/interactor';

import MultiSelectInteractor from '@folio/stripes-components/lib/MultiSelection/tests/interactor';

@interactor class PackageFilterModal {
  clickResetAll = clickable('[data-test-package-selection-modal-reset-all]');
  clickSearch = clickable('[data-test-package-selection-modal-submit]');
  packageMultiSelect = new MultiSelectInteractor('#packageFilterSelect');
  modalIsDisplayed = isPresent('#package-filter-modal');
}

export default new PackageFilterModal();

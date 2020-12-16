import {
  interactor,
  text,
  isPresent,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor'; // eslint-disable-line
import DropdownInteractor from '@folio/stripes-components/lib/Dropdown/tests/interactor'; // eslint-disable-line

@interactor class UsageConsolidationContentPackage {
  isUsageConsolidationErrorPresent = isPresent('[data-test-usage-consolidation-error]');
  usageConsolidationErrorText = text('[data-test-usage-consolidation-error]');

  summaryTable = new MultiColumnListInteractor('#packageUsageConsolidationSummary');
  titlesTable = new MultiColumnListInteractor('#packageUsageConsolidationTitles');
  isLoadingMessagePresent = isPresent('[data-test-usage-consolidation-loading-message]');

  actionsDropdown = new DropdownInteractor('#summary-table-actions-dropdown');

  errorToastNotificationPresent = isPresent('[data-test-eholdings-toast]');

  whenLoaded() {
    return this.when(() => this.isUsageConsolidationErrorPresent || this.summaryTable.isPresent);
  }

  whenTitlesLoaded() {
    return this.when(() => this.titlesTable.isPresent);
  }
}

export default UsageConsolidationContentPackage;

import {
  interactor,
  text,
  isPresent,
} from '@bigtest/interactor';

import Button from '@folio/stripes-components/lib/Button/tests/interactor'; // eslint-disable-line
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor'; // eslint-disable-line

@interactor class UsageConsolidationContentResource {
  isUsageConsolidationErrorPresent = isPresent('[data-test-usage-consolidation-error]');
  usageConsolidationErrorText = text('[data-test-usage-consolidation-error]');

  summaryTable = new MultiColumnListInteractor('#resourceUsageConsolidationSummary');
  actionsButton = new Button('#usage-consolidation-actions-dropdown-button');
  fullTextRequestUsageTable = new MultiColumnListInteractor('#fullTextRequestUsageTable');

  whenLoaded() {
    return this.when(() => this.isUsageConsolidationErrorPresent || this.summaryTable.isPresent);
  }
}

export default UsageConsolidationContentResource;

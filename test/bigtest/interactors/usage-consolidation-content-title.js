import {
  interactor,
  text,
  isPresent,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor'; // eslint-disable-line

@interactor class UsageConsolidationContentTitle {
  isUsageConsolidationErrorPresent = isPresent('[data-test-usage-consolidation-error]');
  usageConsolidationErrorText = text('[data-test-usage-consolidation-error]');

  summaryTable = new MultiColumnListInteractor('#titleUsageConsolidationSummary');

  whenLoaded() {
    return this.when(() => this.isUsageConsolidationErrorPresent || this.summaryTable.isPresent);
  }
}

export default UsageConsolidationContentTitle;

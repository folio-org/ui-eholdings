import {
  interactor,
  text,
  isPresent,
} from '@bigtest/interactor';

import Button from '@folio/stripes-components/lib/Button/tests/interactor'; // eslint-disable-line
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor'; // eslint-disable-line

@interactor class UsageConsolidationContentPackage {
  isUsageConsolidationErrorPresent = isPresent('[data-test-usage-consolidation-error]');
  usageConsolidationErrorText = text('[data-test-usage-consolidation-error]');

  summaryTable = new MultiColumnListInteractor('#packageUsageConsolidationSummary');
  titlesTable = new MultiColumnListInteractor('#packageUsageConsolidationTitles');

  actionsButton = new Button('#usage-consolidation-actions-dropdown-button');

  whenLoaded() {
    return this.when(() => this.isUsageConsolidationErrorPresent || this.summaryTable.isPresent);
  }
}

export default UsageConsolidationContentPackage;

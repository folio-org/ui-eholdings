import {
  interactor,
  clickable,
  collection,
  text,
} from '@bigtest/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';

@interactor class UsageConsolidationFilters {
  yearDropdown = new SelectInteractor('[data-test-usage-consolidation-year-filter]');
  yearDropdownOptions = collection('[data-test-usage-consolidation-year-filter] option', {
    value: text(),
  });

  platformTypeDropdown = new SelectInteractor('[data-test-usage-consolidation-platform-type-filter]');
  clickView = clickable('[data-test-usage-consolidation-view-button]');
}

export default UsageConsolidationFilters;

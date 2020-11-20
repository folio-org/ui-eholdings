import {
  interactor,
  clickable,
  collection,
  text,
} from '@bigtest/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';

import Select from './select';

@interactor class UsageConsolidationFilters {
  yearDropdown = new Select('[data-test-usage-consolidation-year-filter]');
  yearDropdownOptions = collection('[data-test-usage-consolidation-year-filter] option', {
    value: text(),
  });

  platformTypeDropdown = new Select('[data-test-usage-consolidation-platform-type-filter]');
  clickView = clickable('[data-test-usage-consolidation-view-button]');
}

export default UsageConsolidationFilters;

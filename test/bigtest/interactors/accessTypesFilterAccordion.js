import {
  action,
  isPresent,
  interactor,
  clickable,
  is,
  property,
} from '@bigtest/interactor';

import MultiSelectInteractor from '@folio/stripes-components/lib/MultiSelection/tests/interactor';
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

export default @interactor class {
  accessTypesAccordion = new AccordionInteractor('#accessTypesFilter');
  accessTypesSelect = new MultiSelectInteractor('#accessTypeFilterSelect');
  hasClearFilterButton = isPresent('#accessTypesFilter button[icon="times-circle-solid"]');

  toggleFilter = clickable('[data-test-toggle-access-types-filter-checkbox]');
  filterCheckboxIsChecked = is('[data-test-toggle-access-types-filter-checkbox]', ':checked');
  accessTypesSelectIsDisabled = property('#accessTypeFilterSelect-input', 'disabled');

  clickClearFilterButton = action(function () {
    return this.click('#accessTypesFilter button[icon="times-circle-solid"]');
  });

  clickAccordionHeader = action(function () {
    return this.click('#accessTypesFilter button[class^="filterSetHeader--"]');
  });
}

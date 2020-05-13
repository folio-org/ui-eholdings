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
  hasAccessTypesAccordion = isPresent('#accessTypesFilter');
  accessTypesAccordion = new AccordionInteractor('#accessTypesFilter');
  accessTypesSelect = new MultiSelectInteractor('#accessTypeFilterSelect');
  hasClearAccessTypesFilter = isPresent('#accessTypesFilter button[icon="times-circle-solid"]');

  toggleSearchByAccessTypes = clickable('[data-test-toggle-access-types-filter-checkbox]');
  accessTypesCheckboxIsChecked = is('[data-test-toggle-access-types-filter-checkbox]', ':checked');
  accessTypesMultiselectIsDisabled = property('#accessTypeFilterSelect-input', 'disabled');

  clearAccessTypesFilter = action(function () {
    return this.click('#accessTypesFilter button[icon="times-circle-solid"]');
  });

  clickAccessTypesHeader = action(function () {
    return this.click('#accessTypesFilter button[class^="filterSetHeader--"]');
  });
}

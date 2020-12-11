import {
  interactor,
  clickable,
  text,
  isPresent,
} from '@bigtest/interactor';

import MultiSelectInteractor from '@folio/stripes-components/lib/MultiSelection/tests/interactor';
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import RadioButtonInteractor from '@folio/stripes-components/lib/RadioButton/tests/interactor';

@interactor class PackageFilterModal {
  modalIsDisplayed = isPresent('#package-filter-modal');

  packageMultiSelectAccordion = new AccordionInteractor('#package-filter-modal-multiselection-label');
  packageMultiSelect = new MultiSelectInteractor('#packageFilterSelect');

  selectionFilterAccordion = new AccordionInteractor('#filter-packages-selected');
  selectionFilterIsPresent = isPresent('#filter-packages-selected [role="region"]');
  selectionFilterAll = new RadioButtonInteractor('[class^="radioButton--"]:nth-of-type(1)');
  selectionFilterSelected = new RadioButtonInteractor('[class^="radioButton--"]:nth-of-type(2)');
  selectionFilterNotSelected = new RadioButtonInteractor('[class^="radioButton--"]:nth-of-type(3)');
  selectionFilterEBSCO = new RadioButtonInteractor('[class^="radioButton--"]:nth-of-type(4)');

  filterCount = text('[class^="badge---"]');

  clickResetAll = clickable('[data-test-package-selection-modal-reset-all]');
  clickSearch = clickable('[data-test-package-selection-modal-submit]');
}

export default new PackageFilterModal();

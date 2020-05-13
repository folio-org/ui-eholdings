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
  tagsAccordion = new AccordionInteractor('#accordionTagFilter');
  tagsSelect = new MultiSelectInteractor('#selectTagFilter');
  hasClearTagFilter = isPresent('#accordionTagFilter button[icon="times-circle-solid"]');

  toggleSearchByTags = clickable('[data-test-tags-checkbox]');
  tagsCheckboxIsChecked = is('[data-test-tags-checkbox]', ':checked');
  tagsMultiselectIsDisabled = property('#selectTagFilter-input', 'disabled');

  clearTagFilter = action(function () {
    return this.click('#accordionTagFilter button[icon="times-circle-solid"]');
  });

  clickTagHeader = action(function () {
    return this.click('#accordionTagFilter button[class^="filterSetHeader--"]');
  });
}

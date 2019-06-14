import {
  interactor,
  clickable
} from '@bigtest/interactor';

// eslint-disable-next-line import/no-extraneous-dependencies
import MultiSelectInteractor from '@folio/stripes-components/lib/MultiSelection/tests/interactor';

@interactor class TagFilter {
  clickTagsAccordion = clickable('#accordionTagFilter');
  selectTags = new MultiSelectInteractor('#selectTagFilter');
}

export default new TagFilter('[data-test-eholdings-tag-filter]');

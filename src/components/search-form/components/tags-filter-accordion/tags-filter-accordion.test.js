import {
  render,
} from '@testing-library/react';
import noop from 'lodash/noop';

import TagsFilterAccordion from './tags-filter-accordion';

const tagsModel = {
  isLoading: false,
};

const AccordionHeader = () => <span>Accordion Header</span>;

const renderTagsFilterAccordion = (props = {}) => render(
  <TagsFilterAccordion
    tagsModel={tagsModel}
    searchByTagsEnabled
    onStandaloneFilterChange={noop}
    onStandaloneFilterToggle={noop}
    isOpen
    header={AccordionHeader}
    dataOptions={[{
      label: 'opt1',
      value: 'opt1',
    }, {
      label: 'opt2',
      value: 'opt1',
    }]}
    handleStandaloneFilterChange={noop}
    onToggle={noop}
    {...props}
  />
);

describe('Given TagsFilterAccordion', () => {
  describe('when selected some items', () => {
    it('should show clear filters button when tags is string', () => {
      const { container } = renderTagsFilterAccordion({
        isOpen: false,
        searchFilter: {
          tags: 'opt1,opt2',
        },
      });

      expect(container.querySelector('[icon=times-circle-solid]')).toBeDefined();
    });

    it('should show clear filters button when tags is array', () => {
      const { container } = renderTagsFilterAccordion({
        isOpen: false,
        searchFilter: {
          tags: ['opt1', 'opt2'],
        },
      });

      expect(container.querySelector('[icon=times-circle-solid]')).toBeDefined();
    });
  });

  describe('when tags data is loading', () => {
    it('should show spinner', () => {
      const { container } = renderTagsFilterAccordion({
        tagsModel: {
          ...tagsModel,
          isLoading: true,
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });
});

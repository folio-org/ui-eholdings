import {
  render,
} from '@folio/jest-config-stripes/testing-library/react';
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

  it('should display options as selected if there are such options in dataOptions', () => {
    const { getAllByText, queryByText } = renderTagsFilterAccordion({
      searchFilter: {
        tags: ['opt1', 'opt2'],
      },
      dataOptions: [{
        label: 'opt1',
        value: 'opt1',
      }],
    });

    expect(getAllByText('opt1')).toBeDefined();
    expect(queryByText('opt2')).not.toBeInTheDocument();
  });
});

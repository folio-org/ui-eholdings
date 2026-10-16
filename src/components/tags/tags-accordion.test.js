import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import noop from 'lodash/noop';

import TagsAccordion from './tags-accordion';
import Harness from '../../../test/jest/helpers/harness';

const resourceRecord = {
  records: {
    'resource-id': {
      attributes: {
        tags: {
          tagList: ['tag-1', 'tag-2'],
        },
      },
    },
  },
};

const renderTagsAccordion = (props) => render(
  <Harness
    storeInitialState={{
      data: { resource: resourceRecord },
    }}
  >
    <TagsAccordion
      id="tags"
      model={{
        type: 'resource',
        id: 'resource-id',
        isLoading: false,
      }}
      onToggle={noop}
      open
      tagsModel={{
        request: {
          isResolved: true,
        },
      }}
      updateFolioTags={noop}
      {...props}
    />
  </Harness>
);

describe('Given TagsAccordion', () => {
  afterEach(cleanup);

  it('should display accordion label', () => {
    const { getByText } = renderTagsAccordion();

    expect(getByText('ui-eholdings.tags')).toBeDefined();
  });

  describe('when accordion is closed', () => {
    it('should display number of tags', () => {
      const { getByTestId } = renderTagsAccordion({
        open: false,
      });

      expect(getByTestId('tags-accordion-tags-length').textContent).toEqual('2');
    });
  });

  describe('when entityTags prop is passed', () => {
    it('should display it instead of the tags from the Redux store', () => {
      const { getByTestId } = renderTagsAccordion({
        open: false,
        entityTags: ['only-tag'],
      });

      expect(getByTestId('tags-accordion-tags-length').textContent).toEqual('1');
    });

    it('should respect an empty list rather than falling back to Redux', () => {
      const { getByTestId } = renderTagsAccordion({
        open: false,
        entityTags: [],
      });

      expect(getByTestId('tags-accordion-tags-length').textContent).toEqual('0');
    });
  });

  describe('when updateEntityTags prop is passed', () => {
    it('should call it when a tag is added', () => {
      const mockUpdateEntityTags = jest.fn();
      const { getByPlaceholderText } = renderTagsAccordion({
        entityTags: [],
        updateEntityTags: mockUpdateEntityTags,
      });
      const input = getByPlaceholderText('stripes-smart-components.enterATag');

      fireEvent.click(input);
      fireEvent.change(input, { target: { value: 'new-tag' } });
      fireEvent.keyDown(input, {
        key: 'Enter',
        keyCode: 'Enter',
        which: 13,
      });

      expect(mockUpdateEntityTags).toHaveBeenCalledWith(
        'resource',
        expect.objectContaining({
          id: 'resource-id',
          data: expect.objectContaining({
            attributes: expect.objectContaining({ tags: { tagList: ['new-tag'] } }),
          }),
        }),
        'resource/resource-id',
      );
    });
  });
});

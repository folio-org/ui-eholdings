import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import Tags from './tags';
import Harness from '../../../test/jest/helpers/harness';

const mockUpdateEntityTags = jest.fn();
const mockUpdateFolioTags = jest.fn();

class ModelMock {
  constructor(model) {
    this.id = model.id;
    this.name = model.name;
    this.tags = model.tags;
    this.contentType = model.contentType;
    this._type = model.type;
  }

  get type() {
    return this._type;
  }
}

const renderTags = (props) => render(
  <Harness>
    <Tags
      entityTags={['tag-1', 'tag-3']}
      model={new ModelMock({
        id: 'model-id',
        name: 'model-name',
        tags: {
          tagList: [],
        },
        type: 'model-type',
        contentType: 'content-type',
      })}
      tags={[{
        id: 'tag-1',
        label: 'tag-1',
      }, {
        id: 'tag-2',
        label: 'tag-2',
      }, {
        id: 'tag-3',
        label: 'tag-3',
      }]}
      updateEntityTags={mockUpdateEntityTags}
      updateFolioTags={mockUpdateFolioTags}
      {...props}
    />
  </Harness>
);

describe('Given Tags', () => {
  afterEach(() => {
    cleanup();
    mockUpdateEntityTags.mockClear();
    mockUpdateFolioTags.mockClear();
  });

  it('should display select label', () => {
    const { getAllByLabelText } = renderTags();

    expect(getAllByLabelText('stripes-smart-components.enterATag')).toBeDefined();
  });

  it('should display entity tags', () => {
    const { getAllByText } = renderTags();

    expect(getAllByText('tag-1')).toBeDefined();
    expect(getAllByText('tag-3')).toBeDefined();
  });

  describe('when adding an existing tag', () => {
    it('should call updateEntityTags', () => {
      const { getByPlaceholderText } = renderTags({
        entityTags: [],
      });

      fireEvent.click(getByPlaceholderText('stripes-smart-components.enterATag'));
      fireEvent.change(getByPlaceholderText('stripes-smart-components.enterATag'), {
        target: {
          value: 'tag-2',
        },
      });

      fireEvent.keyDown(getByPlaceholderText('stripes-smart-components.enterATag'), {
        key: 'Enter',
        keyCode: 'Enter',
        which: 13,
      });

      expect(mockUpdateEntityTags).toBeCalledWith('model-type', {
        id: 'model-id',
        data: {
          attributes: {
            name: 'model-name',
            tags: {
              tagList: ['tag-2'],
            },
          },
          type: 'tags',
        },
      }, 'model-type/model-id');
    });
  });

  describe('when adding an new tag', () => {
    it('should call updateFolioTags', () => {
      const { getByPlaceholderText } = renderTags({
        entityTags: [],
      });

      fireEvent.click(getByPlaceholderText('stripes-smart-components.enterATag'));
      fireEvent.change(getByPlaceholderText('stripes-smart-components.enterATag'), {
        target: {
          value: 'new-tag',
        },
      });

      fireEvent.keyDown(getByPlaceholderText('stripes-smart-components.enterATag'), {
        key: 'Enter',
        keyCode: 'Enter',
        which: 13,
      });

      expect(mockUpdateFolioTags).toBeCalledWith({
        label: 'new-tag',
        description: 'new-tag',
      });
    });
  });

  // skipping to do MultiSelect's onChange prop being called with incorrect items
  describe.skip('when removing a tag', () => {
    it('should call updateEntityTags', () => {
      const {
        getAllByText,
      } = renderTags({
        entityTags: ['tag-1', 'tag-2'],
      });

      fireEvent.click(getAllByText('-')[0]);

      expect(mockUpdateEntityTags).toBeCalledWith('model-type', {
        id: 'model-id',
        data: {
          attributes: {
            name: 'model-name',
            tags: {
              tagList: ['tag-2'],
            },
          },
          type: 'tags',
        },
      }, 'model-type/model-id');
    });
  });
});

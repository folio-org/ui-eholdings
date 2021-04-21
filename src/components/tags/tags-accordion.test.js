import {
  render,
  cleanup,
} from '@testing-library/react';

import TagsAccordion from './tags-accordion';
import Harness from '../../../test/jest/helpers/harness';

const renderTagsAccordion = (props) => render(
  <Harness
    storeInitialState={{
      data: {
        resource: {
          records: {
            'resource-id': {
              attributes: {
                tags: {
                  tagList: ['tag-1', 'tag-2']
                }
              }
            }
          }
        }
      }
    }}
  >
    <TagsAccordion
      id="tags"
      model={{
        type: 'resource',
        id: 'resource-id',
        isLoading: false,
      }}
      onToggle={() => {}}
      open
      tagsModel={{
        request: {
          isResolved: true,
        },
      }}
      updateFolioTags={() => {}}
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
});

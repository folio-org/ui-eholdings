import noop from 'lodash/noop';
import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import ResourceShow from './resource-show';
import Harness from '../../../test/jest/helpers/harness';
import wait from '../../../test/jest/helpers/wait';

const toggleSelectedMock = jest.fn();

const renderResourceShow = ({
  isSelected = true,
} = {}) => render(
  <Harness>
    <CommandList commands={defaultKeyboardShortcuts}>
      <ResourceShow
        accessStatusTypes={{
          items: {
            data: [{
              id: 'access-type-id',
              attributes: {
                name: 'access type',
              },
            }],
          }
        }}
        // costPerUse={{
        //   data: {
        //     resourceCostPerUse: {
        //       type: 'resourceCostPerUse',
        //       resourceId: '58-473-356',
        //       attributes: {
        //         usage: {
        //           platforms: [{
        //             name: 'Wiley Online Library',
        //             isPublisherPlatform: true,
        //             counts: [16, 1, null, null, null, null, null, null, null, null, null, null],
        //             total: 17,
        //           }],
        //           totals: {
        //             publisher: {
        //               counts: [16, 1, null, null, null, null, null, null, null, null, null, null],
        //               total: 17,
        //             }
        //           }
        //         },
        //         analysis: {
        //           cost: 38.906603,
        //           usage: 17,
        //           costPerUse: 2.288623705882353,
        //         },
        //         parameters: {
        //           startMonth: 'jan',
        //           currency: 'UYU'
        //         }
        //       }
        //     }
        //   },
        //   errors: [],
        //   isFailed: false,
        //   isLoaded: true,
        //   isLoading: false,
        // }}
        fetchResourceCostPerUse={() => {}}
        isFreshlySaved={false}
        onEdit={() => {}}
        proxyTypes={{}}
        tagsModel={{}}
        toggleSelected={toggleSelectedMock}
        updateFolioTags={() => {}}
        model={{
          id: 'resource-id',
          name: 'resource-name',
          isSelected,
          isTitleCustom: true,
          titleHasSelectedResources: true,
          title: {
            name: 'title-name',
            isTitleCustom: true,
          },
          package: {
            name: 'package-name',
            titleCount: 2,
          },
          destroy: {
            timestamp: 0,
            isRejected: false,
            errors: [],
          },
          update: {
            timestamp: 0,
            isRejected: false,
            errors: [],
          },
          request: {
            timestamp: 0,
            isRejected: false,
            errors: [],
          },
        }}
      />
    </CommandList>
  </Harness>
);

describe('Given ResourceShow', () => {
  beforeEach(() => {
    toggleSelectedMock.mockClear();
  });

  afterEach(cleanup);

  it('should show pane title', () => {
    const { getAllByText } = renderResourceShow();

    expect(getAllByText('title-name')).toBeDefined();
  });

  describe('when clicking on remove from holdings', () => {
    it('should show confirmation modal', () => {
      const { getByTestId } = renderResourceShow();

      fireEvent.click(getByTestId('toggle-resource-holdings'));

      expect(getByTestId('selection-modal')).toBeDefined();
    });

    it('should confirm selection', () => {
      const { getByTestId } = renderResourceShow();

      fireEvent.click(getByTestId('toggle-resource-holdings'));
      fireEvent.click(getByTestId('resource-deselection-confirmation-yes'));

      expect(toggleSelectedMock.mock.calls.length).toEqual(1);
    });

    it('should cancel selection', async () => {
      const {
        getByTestId,
        queryByTestId,
      } = renderResourceShow();

      fireEvent.click(getByTestId('toggle-resource-holdings'));
      await wait(500);
      fireEvent.click(getByTestId('resource-deselection-confirmation-no'));
      await wait(500);

      expect(queryByTestId('selection-modal')).toBeNull();
    }, 2000);
  });

  describe('when clicking on add to holdings', () => {
    it('should toggle selection', () => {
      const { getByTestId } = renderResourceShow({
        isSelected: false,
      });

      fireEvent.click(getByTestId('toggle-resource-holdings'));

      expect(toggleSelectedMock.mock.calls.length).toEqual(1);
    });
  });
});

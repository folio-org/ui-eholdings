import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import noop from 'lodash/noop';

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
  ...props
} = {}) => render(
  <Harness>
    <CommandList commands={defaultKeyboardShortcuts}>
      <ResourceShow
        accessStatusTypes={{
          isDeleted: false,
          isLoading: false,
          items: {
            data: [{
              id: 'access-type-id',
              type: 'accessTypes',
              attributes: {
                name: 'access type',
              },
            }],
          },
        }}
        fetchResourceCostPerUse={noop}
        isFreshlySaved={false}
        onEdit={noop}
        proxyTypes={{}}
        tagsModel={{}}
        toggleSelected={toggleSelectedMock}
        updateFolioTags={noop}
        model={{
          id: 'resource-id',
          name: 'resource-name',
          isSelected,
          isLoading: false,
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
          data: {
            relationships: {
              accessType: {
                data: {
                  id: 'access-type-id',
                },
              },
            },
          },
        }}
        {...props}
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

  describe('when resource is freshly saved', () => {
    it('should display notification toast', () => {
      const { getByText } = renderResourceShow({
        isFreshlySaved: true,
      });

      expect(getByText('ui-eholdings.resource.toast.isFreshlySaved')).toBeDefined();
    });
  });
});

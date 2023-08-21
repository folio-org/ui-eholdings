import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  act,
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import TitleEditRoute from './title-edit-route';
import Harness from '../../../test/jest/helpers/harness';

const titleId = 'test-title-id';

const history = {
  replace: jest.fn(),
};

const location = {
  pathname: 'pathname',
  search: '?searchType=titles&q=test&offset=1',
  hash: '',
};

const match = {
  isExact: true,
  params: {
    titleId,
  },
  path: '/eholdings/titles/:titleId/edit',
  url: `/eholdings/titles/${titleId}/edit`,
};

const model = {
  id: titleId,
  name: 'Test Title',
  description: '',
  edition: '',
  contributors: [],
  identifiers: [],
  isLoaded: true,
  isLoading: false,
  isTitleCustom: true,
  isPeerReviewed: false,
  publicationType: 'Unspecified',
  update: {
    errors: [],
    isPending: false,
    isRejected: false,
  },
  request: {
    errors: [],
    isRejected: false,
  },
};

const updateRequest = {
  errors: [],
  isResolved: true,
  isPending: false,
  timestamp: 0,
};

const mockGetTitle = jest.fn();
const mockUpdateTitle = jest.fn();
const mockRemoveUpdateRequests = jest.fn();

const getTitleEditRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <TitleEditRoute
        getTitle={mockGetTitle}
        history={history}
        location={location}
        match={match}
        model={model}
        removeUpdateRequests={mockRemoveUpdateRequests}
        updateRequest={updateRequest}
        updateTitle={mockUpdateTitle}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

const renderTitleEditRoute = (props) => render(getTitleEditRoute(props));

describe('Given TitleEditRoute', () => {
  beforeEach(() => {
    mockGetTitle.mockClear();
    mockUpdateTitle.mockClear();
    mockRemoveUpdateRequests.mockClear();
    history.replace.mockClear();
  });

  afterEach(cleanup);

  it('should handle getTitle', async () => {
    await act(async () => {
      await renderTitleEditRoute();
    });

    expect(mockGetTitle).toHaveBeenCalledWith(titleId);
  });

  describe('when titleId in url has changed', () => {
    it('should handle getTitle', async () => {
      const newTitleId = 'new-test-title-id';

      await act(async () => {
        const { rerender } = await renderTitleEditRoute();

        rerender(getTitleEditRoute({
          match: {
            ...match,
            params: {
              titleId: newTitleId,
            },
          },
        }));
      });

      expect(mockGetTitle).toHaveBeenCalledWith(newTitleId);
    });
  });

  describe('when submit form with edited title', () => {
    it('should handle updateTitle', () => {
      const { getByRole } = renderTitleEditRoute();

      const titleNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(titleNameInput, { target: { value: 'New title name' } });
      fireEvent.blur(titleNameInput);

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockUpdateTitle).toHaveBeenCalled();
    });
  });

  describe('when click on close icon', () => {
    it('should redirect to the view title page', () => {
      const { getByRole } = renderTitleEditRoute();

      const titleNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(titleNameInput, { target: { value: 'New title name' } });
      fireEvent.blur(titleNameInput);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

      expect(history.replace).toHaveBeenCalled();
    });
  });

  describe('when title is not custom', () => {
    it('should redirect to the view title page', () => {
      const { rerender } = renderTitleEditRoute();

      rerender(getTitleEditRoute({
        model: {
          ...model,
          isTitleCustom: false,
        },
      }));

      expect(history.replace).toHaveBeenCalled();
    });
  });

  describe('when update request resolves', () => {
    it('should redirect to the view title page', () => {
      const { rerender } = renderTitleEditRoute({
        updateRequest: {
          ...updateRequest,
          isResolved: false,
        },
      });

      rerender(getTitleEditRoute());

      expect(history.replace).toHaveBeenCalled();
    });
  });

  describe('when title is not pending anymore and needs update', () => {
    it('should redirect to the view title page', () => {
      const { rerender } = renderTitleEditRoute({
        model: {
          ...model,
          update: {
            ...model.update,
            isPending: true,
          },
        },
      });

      rerender(getTitleEditRoute());

      expect(history.replace).toHaveBeenCalled();
    });
  });

  describe('when model is not loaded', () => {
    describe('when request is not rejected', () => {
      it('should show spinner', () => {
        const { container } = renderTitleEditRoute({
          model: {
            ...model,
            isLoaded: false,
          },
        });

        expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
      });
    });

    describe('when request is rejected', () => {
      it('should display an error', () => {
        const { getByText } = renderTitleEditRoute({
          model: {
            ...model,
            isLoaded: false,
            request: {
              ...model.request,
              errors: [{ title: 'Error title' }],
              isRejected: true,
            },
          },
        });

        expect(getByText('Error title')).toBeDefined();
      });
    });
  });

  describe('when component is unmounted', () => {
    it('should handle removeUpdateRequests', async () => {
      const { unmount } = await renderTitleEditRoute();

      unmount();

      expect(mockRemoveUpdateRequests).toHaveBeenCalled();
    });
  });
});

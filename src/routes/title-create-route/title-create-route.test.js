import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  act,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import TitleCreateRoute from './title-create-route';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../../components/title/_fields/package-select', () => () => (<div>PackageSelectField component</div>));

const mockHistory = {
  replace: jest.fn(),
  goBack: jest.fn(),
};

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const createRequest = {
  timestamp: 0,
  type: 'create',
  params: {},
  isPending: false,
  isResolved: false,
  isRejected: false,
  records: [],
  meta: {},
  errors: [],
};

const customPackages = {
  records: [
    {
      id: 'test-package-id1',
      name: 'test-package-name1',
    },
    {
      id: 'test-package-id2',
      name: 'test-package-name2',
    },
  ],
  map: jest.fn(),
};

const mockCreateTitle = jest.fn();
const mockGetCustomPackages = jest.fn();
const mockRemoveCreateRequests = jest.fn();

const getTitleCreateRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <TitleCreateRoute
        history={mockHistory}
        location={location}
        createRequest={createRequest}
        createTitle={mockCreateTitle}
        customPackages={customPackages}
        getCustomPackages={mockGetCustomPackages}
        removeCreateRequests={mockRemoveCreateRequests}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

const renderTitleCreateRoute = (props = {}) => render(getTitleCreateRoute(props));

describe('Given TitleCreateRoute', () => {
  beforeEach(() => {
    mockCreateTitle.mockClear();
    mockGetCustomPackages.mockClear();
    mockRemoveCreateRequests.mockClear();
    mockHistory.replace.mockClear();
  });

  afterEach(cleanup);

  it('should handle getCustomPackages', async () => {
    await act(async () => {
      await renderTitleCreateRoute();
    });

    expect(mockGetCustomPackages).toHaveBeenCalled();
  });

  describe('when request is resolved', () => {
    it('should redirect to new title record', () => {
      const { rerender } = renderTitleCreateRoute();

      rerender(getTitleCreateRoute({
        createRequest: {
          ...createRequest,
          isResolved: true,
        },
      }));

      expect(mockHistory.replace).toHaveBeenCalled();
    });
  });

  describe('when request is not resolved', () => {
    it('should not redirect to new title record', () => {
      const { rerender } = renderTitleCreateRoute();

      rerender(getTitleCreateRoute());

      expect(mockHistory.replace).toHaveBeenCalledTimes(0);
    });
  });

  describe('when click on close icon and form is not pristine', () => {
    it('should handle history.goBack', () => {
      const { getByRole } = renderTitleCreateRoute({
        location: {
          ...location,
          state: { eholdings: true },
        },
      });

      const titleNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(titleNameInput, { target: { value: 'Title name' } });
      fireEvent.blur(titleNameInput);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

      expect(mockHistory.goBack).toHaveBeenCalled();
    });
  });

  describe('when fill form with some values and click save', () => {
    it('should handle createTitle action', () => {
      const {
        getByRole,
        getByText,
      } = renderTitleCreateRoute();

      const titleNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(titleNameInput, { target: { value: 'Title name' } });
      fireEvent.blur(titleNameInput);

      fireEvent.click(getByText('stripes-components.saveAndClose'));

      expect(mockCreateTitle).toHaveBeenCalled();
    });
  });
});

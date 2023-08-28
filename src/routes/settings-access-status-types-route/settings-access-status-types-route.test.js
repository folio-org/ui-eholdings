import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import SettingsAccessStatusTypesRoute from './settings-access-status-types-route';
import Harness from '../../../test/jest/helpers/harness';

const mockGetAccessTypes = jest.fn();
const mockUpdateAccessType = jest.fn();
const mockAttachAccessTypes = jest.fn();
const mockConfirmDelete = jest.fn();
const mockDeleteAccessTypes = jest.fn();

jest.mock('../../redux/actions', () => ({
  ...jest.requireActual('../../redux/actions'),
  getAccessTypes: mockGetAccessTypes,
  updateAccessType: mockUpdateAccessType,
  attachAccessType: mockAttachAccessTypes,
  confirmDelete: mockConfirmDelete,
  deleteAccessType: mockDeleteAccessTypes,
}));

const accessTypes = {
  isDeleted: false,
  isLoading: false,
  errors: [],
  items: {
    data: [{
      id: 'access-type-id',
      type: 'accessTypes',
      attributes: {
        name: 'access type',
      },
    }],
  },
};

const mockHistory = {
  push: jest.fn(),
};

const match = {
  isExact: true,
  params: { kbId: 'kbId' },
  path: '/eholdings',
  url: '/eholdings',
};

const getSettingsAccessStatusTypesRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <SettingsAccessStatusTypesRoute
        accessTypes={accessTypes}
        attachAccessType={mockAttachAccessTypes}
        confirmDelete={mockConfirmDelete}
        deleteAccessType={mockDeleteAccessTypes}
        getAccessTypes={mockGetAccessTypes}
        history={mockHistory}
        match={match}
        updateAccessType={mockUpdateAccessType}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

const renderSettingsAccessStatusTypesRoute = (props = {}) => render(getSettingsAccessStatusTypesRoute(props));

describe('Given SettingsAccessStatusTypesRoute', () => {
  beforeEach(() => {
    mockGetAccessTypes.mockClear();
    mockUpdateAccessType.mockClear();
    mockAttachAccessTypes.mockClear();
    mockConfirmDelete.mockClear();
    mockDeleteAccessTypes.mockClear();
  });

  afterEach(cleanup);

  it('should handle getAccessTypes', async () => {
    await act(async () => {
      await renderSettingsAccessStatusTypesRoute();
    });

    expect(mockGetAccessTypes).toHaveBeenCalledWith(match.params.kbId);
  });

  describe('when kbId changes', () => {
    it('should call getAccessTypes with new kbId', async () => {
      await act(async () => {
        const { rerender } = await renderSettingsAccessStatusTypesRoute();

        rerender(getSettingsAccessStatusTypesRoute({
          match: {
            ...match,
            params: {
              kbId: 'new-test-kb-id',
            },
          },
        }));
      });

      expect(mockGetAccessTypes).toHaveBeenCalledWith('new-test-kb-id');
    });
  });

  describe('when data is not loaded', () => {
    it('should show spinner', async () => {
      const { container } = renderSettingsAccessStatusTypesRoute({
        accessTypes: {
          ...accessTypes,
          items: {
            data: null,
          },
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });
});

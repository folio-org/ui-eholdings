import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  act,
} from '@testing-library/react';

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

const accessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  errors: [],
  items: {
    data: [{
      id: 'access-type-id',
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

const renderSettingsAccessStatusTypesRoute = ({ harnessProps = {}, props = {} } = {}) => render(
  <MemoryRouter>
    <Harness
      storeInitialState={{
        data: { accessStatusTypes },
      }}
      {...harnessProps}
    >
      <SettingsAccessStatusTypesRoute
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

    expect(mockGetAccessTypes).toHaveBeenCalled();
  });

  describe('when data is not loaded', () => {
    it('should show spinner', async () => {
      const { container } = renderSettingsAccessStatusTypesRoute({
        harnessProps: {
          storeInitialState: {
            data: {
              accessStatusTypes: {
                items: {
                  data: null,
                },
              },
            },
          },
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });
});

import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  act,
  fireEvent,
} from '@testing-library/react';

import SettingsKnowledgeBaseRoute from './settings-knowledge-base-route';
import Harness from '../../../test/jest/helpers/harness';

const mockConfirmDeleteKBCredentials = jest.fn();
const mockConfirmPatchKBCredentials = jest.fn();
const mockConfirmPostKBCredentials = jest.fn();
const mockDeleteKBCredentials = jest.fn();
const mockGetKbCredentialsKey = jest.fn();
const mockPatchKBCredentials = jest.fn();
const mockPostKBCredentials = jest.fn();

jest.mock('../../redux/actions', () => ({
  ...jest.requireActual('../../redux/actions'),
  confirmDeleteKBCredentials: mockConfirmDeleteKBCredentials,
  confirmPatchKBCredentials: mockConfirmPatchKBCredentials,
  confirmPostKBCredentials: mockConfirmPostKBCredentials,
  deleteKBCredentials: mockDeleteKBCredentials,
  getKbCredentialsKey: mockGetKbCredentialsKey,
  patchKBCredentials: mockPatchKBCredentials,
  postKBCredentials: mockPostKBCredentials,
}));

const mockHistory = {
  replace: jest.fn(),
  push: jest.fn(),
};

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const match = {
  isExact: true,
  params: { kbId: 'kbId' },
  path: '/eholdings',
  url: '/eholdings',
};

const kbCredentials = {
  errors: [],
  hasFailed: false,
  hasKeyLoaded: false,
  hasLoaded: false,
  hasUpdated: false,
  isKeyLoading: false,
  isLoading: false,
  isUpdating: false,
  items: [{
    attributes: {
      apiKey: 'api-key',
      customerId: 'customer-id',
      name: 'Knowledge Base',
      url: 'test-url',
    },
    id: 'kbId',
    type: 'kbCredentials',
    meta: {
      isKeyLoaded: false,
    },
    metadata: {
      createdByUserId: '4a599ce7-95e7-4305-9188-7f946e084296',
      createdByUsername: 'SYSTEM',
      createdDate: '2021-08-30T01:53:26.081+00:00',
      updatedByUserId: '3c0b9d19-925f-55e4-84bb-e07a8f0c2ca3',
      updatedByUsername: 'diku_admin',
      updatedDate: '2021-08-30T01:53:26.081+00:00',
    },
  }],
};

const getSettingsKnowledgeBaseRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <SettingsKnowledgeBaseRoute
        confirmDeleteKBCredentials={mockConfirmDeleteKBCredentials}
        confirmPatchKBCredentials={mockConfirmPatchKBCredentials}
        confirmPostKBCredentials={mockConfirmPostKBCredentials}
        deleteKBCredentials={mockDeleteKBCredentials}
        getKbCredentialsKey={mockGetKbCredentialsKey}
        history={mockHistory}
        kbCredentials={kbCredentials}
        location={location}
        match={match}
        patchKBCredentials={mockPatchKBCredentials}
        postKBCredentials={mockPostKBCredentials}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

const renderSettingsKnowledgeBaseRoute = (props = {}) => render(getSettingsKnowledgeBaseRoute(props));

describe('Given SettingsKnowledgeBaseRoute', () => {
  beforeEach(() => {
    mockConfirmDeleteKBCredentials.mockClear();
    mockConfirmPatchKBCredentials.mockClear();
    mockConfirmPostKBCredentials.mockClear();
    mockDeleteKBCredentials.mockClear();
    mockGetKbCredentialsKey.mockClear();
    mockPatchKBCredentials.mockClear();
    mockPostKBCredentials.mockClear();
  });

  afterEach(cleanup);

  it('should handle getKbCredentialsKey', async () => {
    await act(async () => {
      await renderSettingsKnowledgeBaseRoute();
    });

    expect(mockGetKbCredentialsKey).toHaveBeenCalledWith('kbId');
  });

  describe('when kb was deleted', () => {
    it('should redirect to /settings/holdings', async () => {
      await act(async () => {
        await renderSettingsKnowledgeBaseRoute({
          kbCredentials: {
            ...kbCredentials,
            hasDeleted: true,
          },
        });
      });

      expect(mockHistory.replace).toHaveBeenCalledWith('/settings/eholdings', { eholdings: true });
    });

    it('should handle confirmDeleteKBCredentials', async () => {
      await act(async () => {
        await renderSettingsKnowledgeBaseRoute({
          kbCredentials: {
            ...kbCredentials,
            hasDeleted: true,
          },
        });
      });

      expect(mockConfirmDeleteKBCredentials).toHaveBeenCalled();
    });
  });

  describe('when kb was saved', () => {
    it('should handle confirmPostKBCredentials', async () => {
      await act(async () => {
        await renderSettingsKnowledgeBaseRoute({
          kbCredentials: {
            ...kbCredentials,
            hasSaved: true,
          },
        });
      });

      expect(mockConfirmPostKBCredentials).toHaveBeenCalled();
    });
  });

  describe('when kb was updated', () => {
    it('should handle confirmPatchKBCredentials', async () => {
      await act(async () => {
        await renderSettingsKnowledgeBaseRoute({
          kbCredentials: {
            ...kbCredentials,
            hasUpdated: true,
          },
        });
      });

      expect(mockConfirmPatchKBCredentials).toHaveBeenCalled();
    });
  });

  describe('when change form value and click `Save`', () => {
    it('should handle patchKBCredentials', () => {
      const { getByTestId } = renderSettingsKnowledgeBaseRoute();

      fireEvent.change(getByTestId('kb-name-field'), { target: { value: 'new-kb-name' } });
      fireEvent.blur(getByTestId('kb-name-field'));

      fireEvent.click(getByTestId('settings-form-save-button'));

      expect(mockPatchKBCredentials).toHaveBeenCalled();
    });
  });

  describe('when click on `Delete` button', () => {
    it('should handle deleteKBCredentials', () => {
      const {
        getByText,
        getByTestId,
      } = renderSettingsKnowledgeBaseRoute();

      fireEvent.click(getByText('ui-eholdings.settings.kb.delete'));
      fireEvent.click(getByTestId('confirm-delete-button'));

      expect(mockDeleteKBCredentials).toHaveBeenCalled();
    });
  });
});

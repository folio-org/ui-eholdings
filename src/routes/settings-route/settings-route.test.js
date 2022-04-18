import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  act,
} from '@testing-library/react';

import SettingsRoute from './settings-route';
import Harness from '../../../test/jest/helpers/harness';

const mockGetKbCredentials = jest.fn();

const kbCredentials = {
  errors: [],
  hasFailed: false,
  hasKeyLoaded: false,
  hasLoaded: true,
  hasUpdated: false,
  isKeyLoading: false,
  isLoading: false,
  isUpdating: false,
  items: [
    {
      attributes: {
        apiKey: 'api-key',
        customerId: 'customer-id',
        name: 'Knowledge Base',
        url: 'test-url',
      },
      id: 'test-kb-id',
      type: 'kbCredentials',
      metadata: {
        createdByUserId: '4a599ce7-95e7-4305-9188-7f946e084296',
        createdByUsername: 'SYSTEM',
        createdDate: '2021-08-30T01:53:26.081+00:00',
        updatedByUserId: '3c0b9d19-925f-55e4-84bb-e07a8f0c2ca3',
        updatedByUsername: 'diku_admin',
        updatedDate: '2021-08-30T01:53:26.081+00:00',
      },
    },
    {
      attributes: {
        apiKey: 'api-key-2',
        customerId: 'customer-id-2',
        name: 'Another Knowledge Base',
        url: 'test-url-2',
      },
      id: 'test-kb-id-2',
      type: 'kbCredentials',
      metadata: {
        createdByUserId: '4a599ce7-95e7-4305-9188-7f946e084296',
        createdByUsername: 'SYSTEM',
        createdDate: '2021-08-30T01:53:26.081+00:00',
        updatedByUserId: '3c0b9d19-925f-55e4-84bb-e07a8f0c2ca3',
        updatedByUsername: 'diku_admin',
        updatedDate: '2021-08-30T01:53:26.081+00:00',
      },
    },
  ],
};

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const renderSettingsRoute = (props = {}) => render(
  <MemoryRouter>
    <Harness>
      <SettingsRoute
        getKbCredentials={mockGetKbCredentials}
        kbCredentials={kbCredentials}
        location={location}
        {...props}
      >
        <span>Content</span>
      </SettingsRoute>
    </Harness>
  </MemoryRouter>
);

describe('Given SettingsRoute', () => {
  beforeEach(() => {
    mockGetKbCredentials.mockClear();
  });

  afterEach(cleanup);

  it('should render children', () => {
    const { getByText } = renderSettingsRoute();

    expect(getByText('Content')).toBeDefined();
  });

  it('should display correct page title', () => {
    renderSettingsRoute();

    expect(document.title).toEqual('ui-eholdings.label.settings - FOLIO');
  });

  it('should handle getKbCredentials', async () => {
    await act(async () => {
      await renderSettingsRoute();
    });

    expect(mockGetKbCredentials).toHaveBeenCalled();
  });
});

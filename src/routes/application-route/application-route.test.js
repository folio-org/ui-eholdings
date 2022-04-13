import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
} from '@testing-library/react';

import ApplicationRoute from './application-route';
import Harness from '../../../test/jest/helpers/harness';

const mockGetBackendStatus = jest.fn();
const mockGetKbCredentials = jest.fn();

const kbCredentials = {
  errors: [],
  hasFailed: false,
  hasKeyLoaded: false,
  hasLoaded: false,
  hasUpdated: false,
  isKeyLoading: false,
  isLoading: false,
  isUpdating: false,
  items: [],
};

const status = {
  isConfigurationValid: false,
  isLoaded: false,
  isLoading: false,
  request: {
    isRejected: false,
    status: 200,
  },
};

const getApplicationRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <ApplicationRoute
        getBackendStatus={mockGetBackendStatus}
        getKbCredentials={mockGetKbCredentials}
        interfaces={{
          eholdings: {
            version: '1.0',
          },
        }}
        kbCredentials={kbCredentials}
        showSettings={false}
        status={status}
        {...props}
      >
        Page content
      </ApplicationRoute>
    </Harness>
  </MemoryRouter>
);

const renderApplicationRoute = (props) => render(getApplicationRoute(props));

describe('Given ApplicationRoute', () => {
  beforeEach(() => {
    mockGetBackendStatus.mockClear();
    mockGetKbCredentials.mockClear();
  });

  afterEach(cleanup);

  describe('when page is not settings', () => {
    it('should call status endpoint', () => {
      renderApplicationRoute();

      expect(mockGetBackendStatus).toBeCalledTimes(1);
    });
  });

  describe('when page is settings', () => {
    it('should call status endpoint', () => {
      renderApplicationRoute({
        showSettings: true,
      });

      expect(mockGetBackendStatus).not.toBeCalled();
    });
  });

  describe('when component is initialized', () => {
    it('should call kb credentials endpoint', () => {
      renderApplicationRoute();

      expect(mockGetKbCredentials).toBeCalledTimes(1);
    });
  });

  describe('when showing settings page and configuration is valid', () => {
    it('should render page', () => {
      const { getByText } = renderApplicationRoute({
        status: {
          ...status,
          isLoaded: true,
          isConfigurationValid: true,
        },
      });

      expect(getByText('Page content')).toBeDefined();
    });
  });

  describe('when backend is not configured and there is not more that 1 kb credential', () => {
    it('should render invalid backend error message', () => {
      const { getByText } = renderApplicationRoute({
        status: {
          ...status,
          isLoaded: true,
          isConfigurationValid: false,
        },
      });

      expect(getByText('ui-eholdings.server.errors.kbNotConfigured')).toBeDefined();
    });
  });

  describe('when backend is not configured and there is more that 1 kb credential', () => {
    it('should render user not assigned to kb error message', () => {
      const { getByText } = renderApplicationRoute({
        status: {
          ...status,
          isLoaded: true,
          isConfigurationValid: false,
        },
        kbCredentials: {
          ...kbCredentials,
          isLoaded: true,
          items: [{
            id: 'e5fe6cbe-53e4-4704-96ea-1168256d6ed7',
            type: 'kbCredentials',
            attributes: {
              name: 'Dummy Credentials',
              customerId: 'customer',
              url: 'https://test.url',
              apiKey : '****************************************',
            },
            metadata: {
              createdDate : '2022-03-30T15:08:28.131+00:00',
              createdByUserId : '9e58d347-6e39-560a-b4cb-2e165632e464',
              createdByUsername : 'diku_admin',
            },
          }, {
            id: 'e5fe6cbe-53e4-4704-96ea-1168256d6ed8',
            type: 'kbCredentials',
            attributes: {
              name: 'Dummy Credentials 2',
              customerId: 'customer',
              url: 'https://test.url',
              apiKey : '****************************************',
            },
            metadata: {
              createdDate : '2022-03-30T15:08:28.131+00:00',
              createdByUserId : '9e58d347-6e39-560a-b4cb-2e165632e464',
              createdByUsername : 'diku_admin',
            },
          }],
        },
      });

      expect(getByText('ui-eholdings.server.errors.userNotAssignedToKb')).toBeDefined();
    });
  });

  describe('when status request is rejected due to api limit exceeded error and page is not settings', () => {
    it('should render api limit exceeded error message', () => {
      const { getByText } = renderApplicationRoute({
        status: {
          ...status,
          request: {
            isRejected: true,
            status: 429,
          },
        },
      });

      expect(getByText('ui-eholdings.server.errors.unableToCompleteOperation')).toBeDefined();
    });
  });

  describe('when status request is rejected due to other error and page is not settings', () => {
    it('should render api limit exceeded error message', () => {
      const { getByText } = renderApplicationRoute({
        status: {
          ...status,
          request: {
            isRejected: true,
            status: 500,
          },
        },
      });

      expect(getByText('ui-eholdings.server.errors.failedBackend')).toBeDefined();
    });
  });

  describe('when status request is rejected due to api limit exceeded error and page is settings', () => {
    it('should render page content', () => {
      const { getByText } = renderApplicationRoute({
        status: {
          ...status,
          request: {
            isRejected: true,
            status: 429,
          },
        },
        showSettings: true,
      });

      expect(getByText('Page content')).toBeDefined();
    });
  });

  describe('when kb credentials and status are loading and page is not settings', () => {
    it('should render loading icon', () => {
      const { container } = renderApplicationRoute({
        status: {
          ...status,
          isLoading: true,
        },
        kbCredentials: {
          ...kbCredentials,
          isLoading: true,
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when eholdings interface is missing, status is not loading and page is not settings', () => {
    it('should render no backend error', () => {
      const { getByText } = renderApplicationRoute({
        interfaces: {
          eholdings: null,
        },
      });

      expect(getByText('ui-eholdings.server.errors.noKbDetected')).toBeDefined();
    });
  });
});

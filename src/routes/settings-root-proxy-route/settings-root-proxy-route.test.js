import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  act,
  fireEvent,
} from '@testing-library/react';

import SettingsRootProxyRoute from './settings-root-proxy-route';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../../components/settings/settings-root-proxy', () => ({ onSubmit }) => (
  <button
    type="button"
    onClick={() => onSubmit({ rootProxyServer: 'root-proxy-server' })}
  >
    SettingsRootProxyRoute
  </button>
));

const history = {
  push: jest.fn(),
};

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const match = {
  isExact: true,
  params: {
    kbId: 'test-kb-id',
  },
  path: '/eholdings',
  url: '/eholdings',
};

const rootProxy = {
  data: {
    credentialsId: 'credentials-id',
    attributes: {
      proxyTypeId: 'proxy-type-id',
    },
  },
};

const mockConfirmUpdateRootProxy = jest.fn();
const mockGetProxyTypes = jest.fn();
const mockGetRootProxy = jest.fn();
const mockUpdateRootProxy = jest.fn();

const getSettingsRootProxyRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <SettingsRootProxyRoute
        confirmUpdateRootProxy={mockConfirmUpdateRootProxy}
        getProxyTypes={mockGetProxyTypes}
        getRootProxy={mockGetRootProxy}
        updateRootProxy={mockUpdateRootProxy}
        history={history}
        location={location}
        match={match}
        proxyTypes={{}}
        rootProxy={rootProxy}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

const renderSettingsRootProxyRoute = (props) => render(getSettingsRootProxyRoute(props));

describe('Given SettingsRootProxyRoute', () => {
  beforeEach(() => {
    mockConfirmUpdateRootProxy.mockClear();
    mockGetProxyTypes.mockClear();
    mockGetProxyTypes.mockClear();
    mockUpdateRootProxy.mockClear();
  });

  afterEach(cleanup);

  it('should render route view', async () => {
    const { getByText } = renderSettingsRootProxyRoute();

    expect(getByText('SettingsRootProxyRoute')).toBeDefined();
  });

  it('should request initial data', async () => {
    await act(async () => {
      await renderSettingsRootProxyRoute();
    });

    expect(mockGetProxyTypes).toHaveBeenCalledWith('test-kb-id');
    expect(mockGetRootProxy).toHaveBeenCalledWith('test-kb-id');
  });

  describe('when kbId has changed', () => {
    it('should request new data', async () => {
      await act(async () => {
        const { rerender } = await renderSettingsRootProxyRoute();

        rerender(getSettingsRootProxyRoute({
          match: {
            ...match,
            params: {
              kbId: 'new-test-kb-id',
            },
          },
        }));
      });

      expect(mockGetProxyTypes).toHaveBeenCalledWith('new-test-kb-id');
      expect(mockGetRootProxy).toHaveBeenCalledWith('new-test-kb-id');
    });
  });

  describe('when root proxy was updated', () => {
    it('should call confirmUpdateRootProxy', async () => {
      await act(async () => {
        const { rerender } = await renderSettingsRootProxyRoute();

        rerender(getSettingsRootProxyRoute({
          rootProxy: {
            isFailed: false,
            isLoading: false,
            isUpdated: true,
            errors: [],
            data: {
              attributes: {
                id: 'proxy-id',
                proxyTypeId: 'proxy-type-id',
              },
              id: 'proxy-id',
              type: 'rootProxy',
            },
          },
        }));
      });

      expect(mockConfirmUpdateRootProxy).toHaveBeenCalled();
    });
  });

  describe('when View form was submitted', () => {
    it('should call rootProxySubmitted', () => {
      const { getByText } = renderSettingsRootProxyRoute();

      fireEvent.click(getByText('SettingsRootProxyRoute'));

      expect(mockUpdateRootProxy).toBeCalledWith({
        attributes: {
          proxyTypeId: 'root-proxy-server',
        },
      }, 'test-kb-id');
    });
  });
});

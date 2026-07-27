import { MemoryRouter, Route } from 'react-router-dom';
import { useHistory } from 'react-router';
import noop from 'lodash/noop';

import {
  render,
  cleanup,
  fireEvent,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import ProviderShowRoute from './provider-show-route';
import { useProviderPackages } from '../../hooks';
import { getAccessTypes } from '../../redux/actions';
import Harness from '../../../test/jest/helpers/harness';

const mockGetProvider = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
  useParams: jest.fn().mockReturnValue({ providerId: 'provider-id' }),
}));

jest.mock('../../redux/actions', () => ({
  ...jest.requireActual('../../redux/actions'),
  getAccessTypes: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useProviderPackages: jest.fn().mockReturnValue({}),
}));

jest.mock('../../components/prev-next-buttons', () => () => (<div>PrevNextButtons component</div>));

const accessTypes = {
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
};

const model = {
  id: 'provider-id',
  name: 'provider-name',
  packagesSelected: 10,
  packagesTotal: 100,
  isLoaded: true,
  isLoading: false,
  proxy: {
    id: 'ezproxy',
    inherited: true,
  },
  update: {
    errors: [],
    isPending: false,
    isRejected: false,
    isResolved: false,
  },
  request: {
    errors: [],
    isPending: false,
    isRejected: false,
    isResolved: true,
  },
  destroy: {
    errors: [],
    isRejected: false,
  },
  data: {
    id: 'provider-id',
    attributes: {
      name: 'provider-name',
    },
    isLoaded: true,
    isLoading: false,
  },
};

const proxyTypes = {
  resolver: {
    state: {
      proxyTypes: {
        records: {},
      },
    },
  },
  request: {
    isResolved: true,
  },
};

const rootProxy = {
  data: {
    attributes: {
      proxyTypeId: 'ezproxy',
    },
  },
  request: {
    isResolved: true,
  },
};

const tagsModel = {
  request: {
    isResolved: true,
  },
};

const tagsModelOfAlreadyAddedTags = {
  request: {
    isResolved: true,
  },
};

const renderProviderShowRoute = (props = {}) => render(
  <MemoryRouter initialEntries={['/eholdings/providers/provider-id']}>
    <Route path="/eholdings/providers/:providerId">
      <Harness>
        <ProviderShowRoute
          accessTypes={accessTypes}
          proxyTypes={proxyTypes}
          rootProxy={rootProxy}
          tagsModel={tagsModel}
          tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
          model={model}
          getAccessTypes={getAccessTypes}
          getProvider={mockGetProvider}
          getProxyTypes={noop}
          getRootProxy={noop}
          getTags={noop}
          updateFolioTags={noop}
          {...props}
        />
      </Harness>
    </Route>
  </MemoryRouter>
);

describe('Given ProviderShowRoute', () => {
  const mockHistoryReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useHistory.mockClear().mockReturnValue({
      replace: mockHistoryReplace,
    });
  });

  afterEach(cleanup);

  it('should call getAccessTypes', async () => {
    await renderProviderShowRoute();

    expect(getAccessTypes).toHaveBeenCalled();
  });

  it('should show search input and actions menu within packages accordion', () => {
    const { getByRole } = renderProviderShowRoute();

    expect(getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' })).toBeInTheDocument();
  });

  describe('when entering some value in the search input and filters', () => {
    it('should perform package search with correct parameters', async () => {
      const { getByRole, getByLabelText } = renderProviderShowRoute();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      const packagesSearchBox = getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' });
      const packagesSearchSelectionStatusSelected = getByLabelText('ui-eholdings.selected');
      const packagesSearchContentType = within(
        getByRole('radiogroup', { name: 'ui-eholdings.package.contentType' })
      ).getByRole('combobox');

      fireEvent.change(packagesSearchBox, { target: { value: 'Test package name' } });
      userEvent.click(packagesSearchSelectionStatusSelected);
      userEvent.selectOptions(packagesSearchContentType, ['ebook']);

      await waitFor(() => expect(useProviderPackages).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchParams: expect.objectContaining({
            q: 'Test package name',
            filter: expect.objectContaining({
              selected: 'true',
              type: 'ebook',
            }),
          }),
        }),
      ));
    });
  });

  it('should call getProvider', async () => {
    await renderProviderShowRoute({
      match: {
        params: { providerId: 'other-provider-id' },
      },
    });

    expect(mockGetProvider).toHaveBeenCalled();
  });

  it('should handle Edit', async () => {
    const { getByRole } = await renderProviderShowRoute();

    fireEvent.click(getByRole('button', { name: 'ui-eholdings.actionMenu.edit' }));

    expect(mockHistoryReplace).toHaveBeenCalledWith({
      pathname: `/eholdings/providers/${model.id}/edit`,
      search: '',
      state: {
        eholdings: true,
      },
    });
  });
});

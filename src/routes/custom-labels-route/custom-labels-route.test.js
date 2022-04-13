import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  act,
} from '@testing-library/react';

import CustomLabelsRoute from './custom-labels-route';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../../components/settings/settings-custom-labels', () => () => <div>Custom Labels view</div>);

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
  params: {
    kbId: 'test-kb-id',
  },
  path: '/eholdings',
  url: '/eholdings',
};

const mockConfirmUpdate = jest.fn();
const mockGetCustomLabels = jest.fn();
const mockUpdateCustomLabels = jest.fn();

const customLabels = {
  isLoading: false,
  items: {
    data: [],
  },
  errors: [],
};

const getCustomLabelsRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <CustomLabelsRoute
        confirmUpdate={mockConfirmUpdate}
        getCustomLabels={mockGetCustomLabels}
        updateCustomLabels={mockUpdateCustomLabels}
        customLabels={customLabels}
        history={mockHistory}
        location={location}
        match={match}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

const renderCustomLabelsRoute = (props) => render(getCustomLabelsRoute(props));

describe('Given CustomLabelsRoute', () => {
  beforeEach(() => {
    mockConfirmUpdate.mockClear();
    mockGetCustomLabels.mockClear();
    mockUpdateCustomLabels.mockClear();
  });

  afterEach(cleanup);

  it('should render page title', async () => {
    const { getByText } = renderCustomLabelsRoute();

    expect(getByText('Custom Labels view')).toBeDefined();
  });

  it('should call getCustomLabels with correct kbId', async () => {
    await act(async () => {
      await renderCustomLabelsRoute();
    });

    expect(mockGetCustomLabels).toHaveBeenCalledWith('test-kb-id');
  });

  describe('when kbId changes', () => {
    it('should call getCustomLabels with new kbId', async () => {
      await act(async () => {
        const { rerender } = await renderCustomLabelsRoute();

        rerender(getCustomLabelsRoute({
          match: {
            ...match,
            params: {
              kbId: 'new-test-kb-id',
            },
          },
        }));
      });

      expect(mockGetCustomLabels).toHaveBeenCalledWith('new-test-kb-id');
    });
  });

  describe('when customLabels are loading', () => {
    it('should render spinner', () => {
      const {
        container,
        queryByText,
      } = renderCustomLabelsRoute({
        customLabels: {
          isLoading: true,
          items: [],
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
      expect(queryByText('Custom Labels view')).toBeNull();
    });
  });
});

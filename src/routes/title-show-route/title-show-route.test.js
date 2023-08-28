import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  act,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { createMemoryHistory } from 'history';
import Harness from '../../../test/jest/helpers/harness';

import TitleShowRoute from './title-show-route';

jest.mock('../../components/title/show', () => ({
  addCustomPackage,
  fetchTitleCostPerUse,
  onEdit,
  onPackageFilter,
}) => (
  <>
    <button
      type="button"
      onClick={addCustomPackage}
    >
      Add to custom package
    </button>

    <button
      type="button"
      onClick={fetchTitleCostPerUse}
    >
      Fetch title cost per use
    </button>

    <button
      type="button"
      onClick={onEdit}
    >
      Edit
    </button>

    <button
      type="button"
      onClick={onPackageFilter}
    >
      Filter packages
    </button>
  </>
));

const history = createMemoryHistory();
const historyPushSpy = jest.spyOn(history, 'push');
const historyReplaceSpy = jest.spyOn(history, 'replace');

const titleId = 'test-title-id';

const costPerUse = {
  data: {
    titleCostPerUse: {
      attributes: {
        analysis: {
          holdingsSummary: [],
        },
      },
      id: 'cost-per-use-id',
      type: 'titleCostPerUse',
    },
  },
  errors: [],
  isFailed: false,
  isLoaded: false,
  isLoading: false,
  isPackageTitlesFailed: false,
  isPackageTitlesLoaded: false,
  isPackageTitlesLoading: false,
};

const createRequest = {
  errors: [],
  isResolved: true,
  isRejected: false,
  isPending: false,
  records: [],
  type: 'create',
};

const mapMock = jest.fn();

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
  map: mapMock,
};

const location = {
  pathname: 'pathname',
  search: '?searchType=titles&q=test&offset=1',
  hash: '',
};

const match = {
  isExact: true,
  params: { titleId },
  path: '/eholdings/titles/:titleId',
  url: `/eholdings/titles/${titleId}`,
};

const model = {
  id: titleId,
  name: 'Test Title',
  publisherName: 'Test publisher',
  publicationType: 'Book',
  isPeerReviewed: false,
  isTitleCustom: true,
  description: '',
  edition: '',
  isLoaded: true,
  isLoading: false,
  contributors: [{
    contributor: 'Jane Doe',
    type: 'author',
  }],
  resources: {
    length: 0,
    records: [],
  },
  hasSelectedResources: false,
  identifiers: [{
    id: 'identifier-id',
    type: 'ISBN',
    subtype: 'Online',
  }],
  subjects: [],
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
    isResolved: false,
  },
  destroy: {
    errors: [],
    isPending: false,
    isRejected: false,
    isResolved: false,
  },
};

const mockClearCostPerUseData = jest.fn();
const mockCreateResource = jest.fn();
const mockGetCostPerUse = jest.fn();
const mockGetCustomPackages = jest.fn();
const mockGetTitle = jest.fn();

const getTitleShowRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <TitleShowRoute
        clearCostPerUseData={mockClearCostPerUseData}
        costPerUse={costPerUse}
        createRequest={createRequest}
        createResource={mockCreateResource}
        customPackages={customPackages}
        getCostPerUse={mockGetCostPerUse}
        getCustomPackages={mockGetCustomPackages}
        getTitle={mockGetTitle}
        history={history}
        location={location}
        match={match}
        model={model}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

const renderTitleShowRoute = (props) => render(getTitleShowRoute(props));

describe('Given TitleShowRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it('should handle getTitle', async () => {
    await act(async () => {
      await renderTitleShowRoute();
    });

    expect(mockGetTitle).toHaveBeenCalledWith(titleId);
  });

  it('should handle getCustomPackages', async () => {
    await act(async () => {
      await renderTitleShowRoute();
    });

    expect(mockGetCustomPackages).toHaveBeenCalled();
  });

  describe('when titleId in url has changed', () => {
    it('should handle getTitle', async () => {
      const newTitleId = 'new-test-title-id';

      await act(async () => {
        const { rerender } = await renderTitleShowRoute();

        rerender(getTitleShowRoute({
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

  describe('when create request resolves', () => {
    it('should redirect to the view resource page', () => {
      const { rerender } = renderTitleShowRoute({
        createRequest: {
          ...createRequest,
          isResolved: false,
        },
      });

      rerender(getTitleShowRoute());

      expect(historyPushSpy).toHaveBeenCalled();
    });
  });

  describe('when click on Add to custom package button', () => {
    it('should handle createResource', () => {
      const { getByRole } = renderTitleShowRoute();

      fireEvent.click(getByRole('button', { name: 'Add to custom package' }));

      expect(mockCreateResource).toHaveBeenCalled();
    });
  });

  describe('when click on Fetch title cost per use button', () => {
    it('should handle getCostPerUse', () => {
      const { getByRole } = renderTitleShowRoute();

      fireEvent.click(getByRole('button', { name: 'Fetch title cost per use' }));

      expect(mockGetCostPerUse).toHaveBeenCalled();
    });
  });

  describe('when click on Edit button', () => {
    it('should redirect to the edit title page', () => {
      const { getByRole } = renderTitleShowRoute();

      fireEvent.click(getByRole('button', { name: 'Edit' }));

      expect(historyReplaceSpy).toHaveBeenCalled();
    });
  });

  describe('when click on Filter packages button', () => {
    it('should handle getCustomPackages', () => {
      const { getByRole } = renderTitleShowRoute();

      fireEvent.click(getByRole('button', { name: 'Filter packages' }));

      expect(mockGetCustomPackages).toHaveBeenCalled();
    });
  });

  describe('when component is unmounted', () => {
    it('should handle removeUpdateRequests', async () => {
      const { unmount } = await renderTitleShowRoute();

      unmount();

      expect(mockClearCostPerUseData).toHaveBeenCalled();
    });
  });
});

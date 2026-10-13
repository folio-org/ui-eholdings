import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import PackageEdit from './package-edit';
import Harness from '../../../test/jest/helpers/harness';
import getAxe from '../../../test/jest/helpers/get-axe';

const model = {
  name: 'Package name',
  contentType: 'book',
  customCoverage: {
    beginCoverage: '2021-01-01',
    endCoverage: '2021-01-31',
  },
  packageToken: {
    value: 'token',
  },
  visibilityData: {
    isHidden: false,
    reason: '',
  },
  proxy: {
    id: 'proxy-id',
  },
  isSelected: true,
  isLoaded: true,
  isLoading: false,
  isCustom: true,
  request: {
    isRejected: false,
    errors: [],
  },
  update: {
    isPending: false,
    isResolved: true,
    errors: [],
  },
  destroy: {
    isPending: false,
    errors: [],
  },
};

const mockAddPackageToHoldings = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();
const mockDeselectPackage = jest.fn();
const mockDeletePackage = jest.fn();

jest.mock('./edit/components/edit-package-information', () => () => <div>Edit package information</div>);
jest.mock('./edit/components/edit-package-settings', () => () => <div>Edit package settings</div>);

const renderPackageEdit = (props = {}) => render(
  <Harness>
    <PackageEdit
      model={model}
      provider={{
        data: {
          isLoaded: true,
          isLoading: false,
        },
        providerToken: {
          prompt: '',
        },
        proxy: {
          id: 'proxy-id',
        },
      }}
      accessStatusTypes={{
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
      }}
      addPackageToHoldings={mockAddPackageToHoldings}
      onSubmit={mockOnSubmit}
      onCancel={mockOnCancel}
      proxyTypes={{
        request: {
          isResolved: true,
        },
        resolver: {
          state: {
            proxyTypes: {
              records: {
                'proxy-id': {
                  id: 'proxy-id',
                  attributes: {
                    name: 'Some Proxy',
                  },
                },
                'proxy-id-2': {
                  id: 'proxy-id-2',
                  attributes: {
                    name: 'Some Other Proxy',
                  },
                },
              },
            },
          },
        },
      }}
      deselectPackage={mockDeselectPackage}
      deletePackage={mockDeletePackage}
      {...props}
    />
  </Harness>
);

const axe = getAxe();

describe('Given PackageEdit', () => {
  afterEach(() => {
    cleanup();
    mockAddPackageToHoldings.mockClear();
  });

  it('should render page view', () => {
    const { getAllByText } = renderPackageEdit();

    expect(getAllByText('Package name')).toBeDefined();
  });

  it('should have no a11y issues', async () => {
    const { container } = renderPackageEdit();
    const a11yResults = await axe.run(container);

    expect(a11yResults.violations.length).toEqual(0);
  });

  describe('when model is not loaded', () => {
    describe('when request is not rejected', () => {
      it('should show spinner', () => {
        const { container } = renderPackageEdit({
          model: {
            ...model,
            isLoaded: false,
          },
        });

        expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
      });
    });
  });

  describe('when package is managed', () => {
    it('should render page view', () => {
      const { getAllByText } = renderPackageEdit({
        model: {
          ...model,
          isCustom: false,
        },
      });

      expect(getAllByText('Package name')).toBeDefined();
    });

    it('should have no a11y issues', async () => {
      const { container } = renderPackageEdit({
        model: {
          ...model,
          isCustom: false,
        },
      });
      const a11yResults = await axe.run(container);

      expect(a11yResults.violations.length).toEqual(0);
    });
  });
});

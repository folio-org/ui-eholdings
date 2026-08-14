import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { usePackageUpdate } from './use-package-update';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockPut = jest.fn();
const mockExtend = jest.fn(() => ({ put: mockPut }));

const packageId = 'test-id';

describe('Given usePackageUpdate', () => {
  beforeEach(() => {
    mockPut.mockClear().mockReturnValue({ json: jest.fn().mockResolvedValue({}) });
    useOkapiKy.mockClear().mockReturnValue({
      extend: mockExtend,
    });
  });

  describe('when updatePackage is called', () => {
    it('should call PUT with correct packageId', async () => {
      const { result } = renderHook(() => usePackageUpdate({ packageId, onSuccess: jest.fn() }), { wrapper });

      result.current.updatePackage({});

      await waitFor(() => expect(mockPut.mock.calls[0][0]).toEqual(`eholdings/packages/${packageId}`));
    });

    it('should call PUT with correct body', async () => {
      const { result } = renderHook(() => usePackageUpdate({ packageId, onSuccess: jest.fn() }), { wrapper });

      const formValues = {
        name: 'testName',
        isSelected: true,
        allowKbToAddTitles: true,
        contentType: 'contentType',
        customCoverages: [{
          beginCoverage: '',
          endCoverage: '',
        }],
        visibility: [{
          hidden: false,
        }],
        isCustom: false,
        proxy: {},
        packageToken: 'token',
        isPartiallySelected: false,
        accessTypeId: 'access-type',
        customAltNames: [{
          altName: 'altName',
        }],
        customDisplayName: 'displayName',
        thisUndefinedFieldShouldBeRemoved: true,
      };

      const expectedBodyJson = JSON.stringify({
        data: {
          id: packageId,
          attributes: {
            name: 'testName',
            isSelected: true,
            allowKbToAddTitles: true,
            contentType: 'contentType',
            customCoverage: {
              beginCoverage: '',
              endCoverage: '',
            },
            visibility: [{
              hidden: false,
            }],
            isCustom: false,
            proxy: {},
            packageToken: 'token',
            isFullPackage: true,
            accessTypeId: 'access-type',
            customAltNames: [{
              altName: 'altName',
            }],
            customDisplayName: 'displayName',
          },
          type: 'packages',
        },
      });

      result.current.updatePackage(formValues);

      await waitFor(() => expect(mockPut.mock.calls[0][1]).toEqual({
        body: expectedBodyJson,
      }));
    });
  });
});

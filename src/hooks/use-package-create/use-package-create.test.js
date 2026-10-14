import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { usePackageCreate } from './use-package-create';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockPost = jest.fn();
const mockExtend = jest.fn(() => ({ post: mockPost }));

const packageFormValues = {
  name: 'New package',
  contentType: 'Book',
  accessTypeId: 'access-type-id',
  customCoverages: [],
  customAltNames: [],
};

describe('Given usePackageCreate', () => {
  beforeEach(() => {
    mockPost.mockReset();
    useOkapiKy.mockClear().mockReturnValue({
      extend: mockExtend,
    });
  });

  describe('when createPackage is called', () => {
    it('should POST formatted package data to eholdings/packages', async () => {
      mockPost.mockReturnValue({ json: jest.fn().mockResolvedValue({}) });

      const { result } = renderHook(() => usePackageCreate({ onSuccess: jest.fn() }), { wrapper });

      result.current.createPackage(packageFormValues);

      await waitFor(() => expect(mockPost).toHaveBeenCalled());

      expect(mockPost).toHaveBeenCalledWith('eholdings/packages', {
        body: JSON.stringify({
          data: {
            attributes: {
              name: 'New package',
              contentType: 'Book',
              accessTypeId: 'access-type-id',
              customAltNames: [],
            },
            type: 'packages',
          },
        }),
      });
    });
  });

  describe('when the request succeeds', () => {
    it('should call onSuccess with the response', async () => {
      const response = { data: { id: 'new-package-id' } };
      const onSuccess = jest.fn();

      mockPost.mockReturnValue({
        json: jest.fn().mockResolvedValue(response),
      });

      const { result } = renderHook(() => usePackageCreate({ onSuccess }), { wrapper });

      result.current.createPackage(packageFormValues);

      await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(response));
    });
  });

  describe('when the request fails', () => {
    it('should expose the errors from the response body', async () => {
      const errors = [{ title: 'Duplicate package' }];

      mockPost.mockReturnValue({
        json: jest.fn().mockRejectedValue({
          response: {
            json: () => Promise.resolve({ errors }),
          },
        }),
      });

      const onSuccess = jest.fn();

      const { result } = renderHook(() => usePackageCreate({ onSuccess }), { wrapper });

      result.current.createPackage(packageFormValues);

      await waitFor(() => expect(result.current.errors).toEqual(errors));
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});

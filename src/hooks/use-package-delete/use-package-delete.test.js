import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { usePackageDelete } from './use-package-delete';

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

describe('Given usePackageDelete', () => {
  beforeEach(() => {
    mockPost.mockReset();
    useOkapiKy.mockClear().mockReturnValue({
      extend: mockExtend,
    });
  });

  describe('when createPackage is called', () => {
    it('should POST formatted package data to eholdings/packages', async () => {
      mockPost.mockReturnValue({ json: jest.fn().mockResolvedValue({}) });

      const { result } = renderHook(() => usePackageDelete({ onSuccess: jest.fn() }), { wrapper });

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

  describe('when customCoverages contains a date range', () => {
    it('should format the dates using YYYY-MM-DD', async () => {
      mockPost.mockReturnValue({ json: jest.fn().mockResolvedValue({}) });

      const { result } = renderHook(() => usePackageDelete({ onSuccess: jest.fn() }), { wrapper });

      result.current.createPackage({
        ...packageFormValues,
        customCoverages: [{
          beginCoverage: '2022-01-15T00:00:00.000Z',
          endCoverage: '2022-10-01T00:00:00.000Z',
        }],
      });

      await waitFor(() => expect(mockPost).toHaveBeenCalled());

      const body = JSON.parse(mockPost.mock.calls[0][1].body);

      expect(body.data.attributes.customCoverage).toEqual({
        beginCoverage: '2022-01-15',
        endCoverage: '2022-10-01',
      });
    });
  });

  describe('when coverage dates are missing', () => {
    it('should send empty strings for the coverage dates', async () => {
      mockPost.mockReturnValue({ json: jest.fn().mockResolvedValue({}) });

      const { result } = renderHook(() => usePackageCreate({ onSuccess: jest.fn() }), { wrapper });

      result.current.createPackage({
        ...packageFormValues,
        customCoverages: [{
          beginCoverage: '',
          endCoverage: '',
        }],
      });

      await waitFor(() => expect(mockPost).toHaveBeenCalled());

      const body = JSON.parse(mockPost.mock.calls[0][1].body);

      expect(body.data.attributes.customCoverage).toEqual({
        beginCoverage: '',
        endCoverage: '',
      });
    });
  });

  describe('when customAltNames contains empty entries', () => {
    it('should filter out the empty entries', async () => {
      mockPost.mockReturnValue({ json: jest.fn().mockResolvedValue({}) });

      const { result } = renderHook(() => usePackageCreate({ onSuccess: jest.fn() }), { wrapper });

      result.current.createPackage({
        ...packageFormValues,
        customAltNames: [
          { altName: 'first name' },
          { altName: '' },
          { altName: 'second name', extra: 'ignored' },
          {},
        ],
      });

      await waitFor(() => expect(mockPost).toHaveBeenCalled());

      const body = JSON.parse(mockPost.mock.calls[0][1].body);

      expect(body.data.attributes.customAltNames).toEqual([
        { altName: 'first name' },
        { altName: 'second name' },
      ]);
    });
  });

  describe('when name and contentType are not provided', () => {
    it('should omit those attributes from the payload', async () => {
      mockPost.mockReturnValue({ json: jest.fn().mockResolvedValue({}) });

      const { result } = renderHook(() => usePackageCreate({ onSuccess: jest.fn() }), { wrapper });

      result.current.createPackage({
        accessTypeId: 'access-type-id',
        customCoverages: [],
        customAltNames: [],
      });

      await waitFor(() => expect(mockPost).toHaveBeenCalled());

      const body = JSON.parse(mockPost.mock.calls[0][1].body);

      expect(body.data.attributes).not.toHaveProperty('name');
      expect(body.data.attributes).not.toHaveProperty('contentType');
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

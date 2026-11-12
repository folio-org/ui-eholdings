import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { usePackageModel } from './use-package-model';
import { usePackage } from '../use-package';
import { usePackageDelete } from '../use-package-delete';
import { usePackageCreate } from '../use-package-create';
import { usePackageUpdate } from '../use-package-update';
import { usePackageTagsUpdate } from '../use-package-tags-update';

jest.mock('../use-package', () => ({
  usePackage: jest.fn(),
}));
jest.mock('../use-package-delete', () => ({
  usePackageDelete: jest.fn(),
}));
jest.mock('../use-package-create', () => ({
  usePackageCreate: jest.fn(),
}));
jest.mock('../use-package-update', () => ({
  usePackageUpdate: jest.fn(),
}));
jest.mock('../use-package-tags-update', () => ({
  usePackageTagsUpdate: jest.fn(),
}));

const mockPackageDelete = jest.fn();
const mockPackageUpdate = jest.fn();
const mockPackageCreate = jest.fn();
const mockUpdatePackageTags = jest.fn();

describe('Given usePackageModel', () => {
  beforeEach(() => {
    mockPackageUpdate.mockClear();
    usePackage.mockReturnValue({
      data: {
        selectedCount: 1,
        titleCount: 1,
      },
      isLoading: false,
      isLoaded: true,
      isError: false,
      errors: [],
    });
    usePackageDelete.mockReturnValue({
      isError: false,
      errors: [],
      isLoading: false,
      deletePackage: mockPackageDelete,
    });
    usePackageCreate.mockReturnValue({
      createPackage: mockPackageCreate,
    });
    usePackageUpdate.mockReturnValue({
      isLoading: false,
      isError: false,
      errors: [],
      updatePackage: mockPackageUpdate,
      updatePackageAsync: mockPackageUpdate,
    });
    usePackageTagsUpdate.mockReturnValue({
      updatePackageTags: mockUpdatePackageTags,
    });
  });

  it('should expose package delete/create/update/update tags functions', async () => {
    const { result } = renderHook(() => usePackageModel({}));

    expect(result.current).toEqual(expect.objectContaining({
      deletePackage: mockPackageDelete,
      createPackage: mockPackageCreate,
      updatePackage: mockPackageUpdate,
      updatePackageTags: mockUpdatePackageTags,
    }));
  });

  it('should expose model object with required properties', () => {
    const { result } = renderHook(() => usePackageModel({}));

    expect(result.current.model).toEqual(expect.objectContaining({
      selectedCount: 1,
      titleCount: 1,
      isPartiallySelected: false,
      isLoading: false,
      isLoaded: true,
      request: {
        isPending: false,
        isRejected: false,
        errors: [],
      },
      update: {
        isPending: false,
        isRejected: false,
        errors: [],
      },
      destroy: {
        isPending: false,
        isRejected: false,
        errors: [],
      },
    }));
  });

  describe('when package fetch failed', () => {
    it('should be reflected in the model.request object', () => {
      usePackage.mockReturnValue({
        isLoaded: true,
        isLoading: false,
        isError: true,
        errors: [{ title: 'error' }],
        data: {},
      });

      const { result } = renderHook(() => usePackageModel({}));

      expect(result.current.model).toEqual(expect.objectContaining({
        isPartiallySelected: false,
        isLoading: false,
        isLoaded: false,
        request: {
          isPending: false,
          isRejected: true,
          errors: [{ title: 'error' }],
        },
      }));
    });
  });

  describe('when package update failed', () => {
    it('should be reflected in the model.update object', () => {
      usePackageUpdate.mockReturnValue({
        isLoading: false,
        isError: true,
        errors: [{ title: 'error' }],
      });

      const { result } = renderHook(() => usePackageModel({}));

      expect(result.current.model).toEqual(expect.objectContaining({
        isPartiallySelected: false,
        isLoading: false,
        isLoaded: true,
        update: {
          isPending: false,
          isRejected: true,
          errors: [{ title: 'error' }],
        },
      }));
    });
  });

  describe('when package delete failed', () => {
    it('should be reflected in the model.destroy object', () => {
      usePackageDelete.mockReturnValue({
        isLoading: false,
        isError: true,
        errors: [{ title: 'error' }],
      });

      const { result } = renderHook(() => usePackageModel({}));

      expect(result.current.model).toEqual(expect.objectContaining({
        isPartiallySelected: false,
        isLoading: false,
        isLoaded: true,
        destroy: {
          isPending: false,
          isRejected: true,
          errors: [{ title: 'error' }],
        },
      }));
    });
  });

  describe('when calling selectPackage', () => {
    it('should call updatePackageAsync with package attributes that represent selected package', () => {
      usePackage.mockReturnValue({
        isLoaded: true,
        isLoading: false,
        data: {
          titleCount: 1,
          selectedCount: 0,
          isFreeAccess: false,
          url: 'http://test.com',
        },
      });

      const { result } = renderHook(() => usePackageModel({}));

      result.current.selectPackage();

      expect(mockPackageUpdate).toHaveBeenCalledWith({
        titleCount: 1,
        selectedCount: 1,
        isSelected: true,
        allowKbToAddTitles: true,
        isPartiallySelected: false,
        customCoverage: {},
      });
    });
  });

  describe('when calling deselectPackage', () => {
    it('should call updatePackageAsync with package attributes without customization', () => {
      usePackage.mockReturnValue({
        isLoaded: true,
        isLoading: false,
        data: {
          titleCount: 1,
          selectedCount: 1,
          isFreeAccess: false,
          url: 'http://test.com',
        },
      });

      const { result } = renderHook(() => usePackageModel({}));

      result.current.deselectPackage();

      expect(mockPackageUpdate).toHaveBeenCalledWith({
        titleCount: 1,
        selectedCount: 1,
        visibility: null,
        isSelected: false,
        allowKbToAddTitles: false,
        isPartiallySelected: false,
        accessTypeId: null,
        customCoverage: {},
      });
    });
  });
});

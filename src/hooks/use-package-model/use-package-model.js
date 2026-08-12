import { useMemo } from 'react';
import {
  usePackage,
  usePackageDelete,
  usePackageUpdate,
  usePackageCreate,
} from '..';

export const usePackageModel = ({
  packageId,
  onDeleteSuccess,
  onCreateSuccess,
}) => {
  const {
    data,
    isLoading: isPackageLoading,
    isLoaded: isPackageLoaded,
    isError: isFetchError,
    error: fetchError,
  } = usePackage({ packageId });
  const {
    deletePackage,
    isError: isDeleteError,
    error: deleteError,
  } = usePackageDelete({ onSuccess: onDeleteSuccess });
  const {
    updatePackage,
    isLoading: isUpdateLoading,
    isError: isUpdateError,
    errors: updateErrors,
  } = usePackageUpdate({ packageId, onSuccess: () => {} });
  const {
    createPackage,
    isLoading: isPackageCreateLoading,
    errors: packageCreateErrors,
  } = usePackageCreate({
    onSuccess: onCreateSuccess,
  });

  const model = useMemo(() => ({
    ...data,
    isLoading: isPackageLoading,
    isLoaded: isPackageLoaded,
    request: {
      isPending: isPackageLoading,
      isRejected: isFetchError,
      errors: [{ title: fetchError }],
    },
    update: {
      isPending: isUpdateLoading,
      isRejected: isUpdateError,
      errors: updateErrors,
    },
    destroy: {
      isPending: isPackageCreateLoading,
      isRejected: isDeleteError,
      errors: [{ title: deleteError }],
    },
  }), [data, deleteError, fetchError, isDeleteError, isFetchError, isPackageLoading, isPackageCreateLoading, isUpdateError, isUpdateLoading, updateErrors]);

  return {
    model,
    deletePackage,
    updatePackage,
    createPackage,
  };
};

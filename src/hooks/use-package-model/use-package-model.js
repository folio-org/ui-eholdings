import { useMemo } from 'react';

import { usePackage } from '../use-package';
import { usePackageDelete } from '../use-package-delete';
import { usePackageUpdate } from '../use-package-update';
import { usePackageCreate } from '../use-package-create';

export const usePackageModel = ({
  packageId,
  onDeleteSuccess,
  onCreateSuccess,
  onUpdateSuccess,
}) => {
  const {
    data,
    isLoading: isPackageLoading,
    isLoaded: isPackageLoaded,
    isError: isFetchError,
    errors: fetchErrors,
  } = usePackage({ packageId });
  const {
    deletePackage,
    isError: isDeleteError,
    errors: deleteErrors,
  } = usePackageDelete({ onSuccess: onDeleteSuccess });
  const {
    updatePackage,
    isLoading: isUpdateLoading,
    isError: isUpdateError,
    errors: updateErrors,
  } = usePackageUpdate({ packageId, onSuccess: onUpdateSuccess });
  const {
    createPackage,
    isLoading: isPackageCreateLoading,
  } = usePackageCreate({
    onSuccess: onCreateSuccess,
  });

  const model = useMemo(() => ({
    ...data,
    isLoading: isPackageLoading,
    isLoaded: isPackageLoaded && !isFetchError,
    request: {
      isPending: isPackageLoading,
      isRejected: isFetchError,
      errors: fetchErrors,
    },
    update: {
      isPending: isUpdateLoading,
      isRejected: isUpdateError,
      errors: updateErrors,
    },
    destroy: {
      isPending: isPackageCreateLoading,
      isRejected: isDeleteError,
      errors: deleteErrors,
    },
  }), [data, deleteErrors, fetchErrors, isDeleteError, isFetchError, isPackageLoading, isPackageLoaded, isPackageCreateLoading, isUpdateError, isUpdateLoading, updateErrors]);

  return {
    model,
    deletePackage,
    updatePackage,
    createPackage,
  };
};

import { useCallback, useMemo } from 'react';
import { omit } from 'lodash';

import { usePackage } from '../use-package';
import { usePackageDelete } from '../use-package-delete';
import { usePackageUpdate } from '../use-package-update';
import { usePackageCreate } from '../use-package-create';
import { usePackageTagsUpdate } from '../use-package-tags-update';

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
    updatePackageAsync,
    isLoading: isUpdateLoading,
    isError: isUpdateError,
    errors: updateErrors,
  } = usePackageUpdate({ packageId, onSuccess: onUpdateSuccess });
  const { updatePackageTags } = usePackageTagsUpdate({ packageId });
  const {
    createPackage,
    isLoading: isPackageCreateLoading,
  } = usePackageCreate({
    onSuccess: onCreateSuccess,
  });

  const selectPackage = useCallback(() => {
    const attrs = omit(data, ['isFreeAccess', 'url']);

    attrs.selectedCount = attrs.titleCount;
    attrs.isSelected = true;
    attrs.allowKbToAddTitles = true;
    attrs.customCoverage = {};

    return updatePackageAsync(attrs);
  }, [data, updatePackageAsync]);

  const deselectPackage = useCallback(() => {
    const attrs = omit(data, ['isFreeAccess', 'url']);
    // When de-selecting a managed package
    // need to clear out customizations before sending to server
    attrs.isSelected = false;
    attrs.visibility = null;
    attrs.customCoverage = {};
    attrs.allowKbToAddTitles = false;
    attrs.accessTypeId = null;

    return updatePackageAsync(attrs);
  }, [data, updatePackageAsync]);

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
  }), [
    data,
    deleteErrors,
    fetchErrors,
    isDeleteError,
    isFetchError,
    isPackageLoading,
    isPackageLoaded,
    isPackageCreateLoading,
    isUpdateError,
    isUpdateLoading,
    updateErrors,
  ]);

  return {
    model,
    deletePackage,
    updatePackage,
    updatePackageAsync,
    updatePackageTags,
    createPackage,
    selectPackage,
    deselectPackage,
  };
};

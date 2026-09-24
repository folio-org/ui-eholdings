import { useCallback, useMemo } from 'react';
import { omit } from 'lodash';

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

  const selectPackage = useCallback(() => {
    const attrs = omit(data, ['isFreeAccess']);

    attrs.selectedCount = attrs.titleCount;
    attrs.isSelected = true;
    attrs.allowKbToAddTitles = true;
    attrs.customCoverage = {};
    updatePackage(attrs);
  }, [data, updatePackage]);

  const deselectPackage = useCallback(() => {
    const attrs = omit(data, ['isFreeAccess']);
    // When de-selecting a managed package
    // need to clear out customizations before sending to server
    attrs.isSelected = false;
    attrs.visibility = null;
    attrs.customCoverage = {};
    attrs.allowKbToAddTitles = false;
    attrs.accessTypeId = null;
    updatePackage(attrs);
  }, [data, updatePackage]);

  const addToHoldings = useCallback(() => {
    const updatedModel = {
      ...omit(data, ['isFreeAccess']),
      isSelected: true,
      selectedCount: data.titleCount,
      allowKbToAddTitles: true,
    };

    updatePackage(updatedModel);
  }, [data, updatePackage]);

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
    select: selectPackage,
    deselect: deselectPackage,
    addToHoldings,
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
    selectPackage,
    deselectPackage,
    addToHoldings,
  ]);

  return {
    model,
    deletePackage,
    updatePackage,
    createPackage,
  };
};

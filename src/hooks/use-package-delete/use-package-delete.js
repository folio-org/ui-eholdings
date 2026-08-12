import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const usePackageDelete = ({ onSuccess }) => {
  const ky = useOkapiKy().extend({
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
  });

  const {
    mutate,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (packageId) => {
      return ky.delete(`eholdings/packages/${packageId}`)
        .json()
        .then(res => {
          onSuccess(res);
        });
    },
  });

  const deletePackage = (packageId) => {
    mutate(packageId);
  };

  return {
    deletePackage,
    isLoading,
    isError,
    error,
  };
};

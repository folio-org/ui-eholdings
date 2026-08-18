import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useBackendResponseErrors } from '../use-backend-response-errors';

export const usePackageDelete = ({ onSuccess }) => {
  const ky = useOkapiKy().extend({
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
  });
  const { onError, errors } = useBackendResponseErrors();

  const {
    mutate,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: (packageId) => {
      return ky.delete(`eholdings/packages/${packageId}`)
        .json()
        .then(res => {
          onSuccess(res);
        });
    },
    onError,
  });

  const deletePackage = (packageId) => {
    mutate(packageId);
  };

  return {
    deletePackage,
    isLoading,
    isError,
    errors,
  };
};

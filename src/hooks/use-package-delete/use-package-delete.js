import { useState } from 'react';
import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const usePackageDelete = ({ onSuccess }) => {
  const ky = useOkapiKy().extend({
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
  });
  const [errors, setErrors] = useState([]);

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
    onError: async (error) => {
      try {
        const body = await error.response.json();
        // for some reason `error` property of the mutation object is not being set
        // returning or throwing an error doesn't set it, so we'll just resort to having a separate
        // state for errors
        setErrors(body.errors);
      } catch (e) {
        setErrors([]);
      }
    },
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

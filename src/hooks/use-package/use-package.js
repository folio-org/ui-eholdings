import { useState } from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const usePackage = ({ packageId }) => {
  const [namespace] = useNamespace({ key: 'package' });
  const ky = useOkapiKy().extend({
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
  });
  const [errors, setErrors] = useState([]);

  // in case if two instances of this hook are called with int packageId and string packageId
  // we want to keep the query key consistent so request results can be reused without extra requests
  const packageIdString = String(packageId);
  const { data = {}, isFetching, isFetched, isError } = useQuery(
    [namespace, packageIdString],
    () => ky.get(`eholdings/packages/${packageIdString}`).json(),
    {
      enabled: Boolean(packageIdString),
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
    },
  );

  /* response structure
    {
      data: {
        id: providerId+packageId
        attributes: {
          ...rest of attributes
        }
      }
    }
  */
  const packageData = {
    ...data.data?.attributes,
    id: data.data?.id,
  };

  return {
    isLoading: isFetching,
    isLoaded: isFetched,
    isError,
    errors,
    data: packageData,
  };
};

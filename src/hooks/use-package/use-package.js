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

  // in case if two instances of this hook are called with int packageId and string packageId
  // we want to keep the query key consistent so request results can be reused without extra requests
  const packageIdString = String(packageId);
  const { data = {}, isFetching, isFetched } = useQuery(
    [namespace, packageIdString],
    () => ky.get(`eholdings/packages/${packageIdString}`).json(),
    { enabled: Boolean(packageIdString) },
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
    data: packageData,
  };
};

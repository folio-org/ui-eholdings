import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { useBackendResponseErrors } from '../use-backend-response-errors';
import { serializePackageAttributes } from '../../utils/serialize-package';

export const usePackage = ({ packageId }) => {
  const [namespace] = useNamespace({ key: 'package' });
  const ky = useOkapiKy().extend({
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
  });
  const { onError, errors } = useBackendResponseErrors();

  // in case if two instances of this hook are called with int packageId and string packageId
  // we want to keep the query key consistent so request results can be reused without extra requests
  const packageIdString = packageId && String(packageId);

  const { data = {}, isFetching, isFetched, isError } = useQuery({
    queryKey: [namespace, packageIdString],
    queryFn: () => ky.get(`eholdings/packages/${packageIdString}`).json(),
    enabled: Boolean(packageIdString),
    onError,
  });

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

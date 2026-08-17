import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useProvider = ({ providerId }) => {
  const [namespace] = useNamespace({ key: 'provider' });
  const ky = useOkapiKy().extend({
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
  });

  // in case if two instances of this hook are called with int providerId and string providerId
  // we want to keep the query key consistent so request results can be reused without extra requests
  const providerIdString = String(providerId);

  const { data = {}, isFetching } = useQuery({
    queryKey: [namespace, providerIdString],
    queryFn: () => ky.get(`eholdings/providers/${providerIdString}`).json(),
    enabled: Boolean(providerIdString),
  });

  /* response structure
    {
      data: {
        id: providerId
        attributes: {
          ...rest of attributes
        }
      }
    }
  */
  const providerData = {
    ...data.data?.attributes,
    id: data.data?.id,
  };

  return {
    isLoading: isFetching,
    data: providerData,
  };
};

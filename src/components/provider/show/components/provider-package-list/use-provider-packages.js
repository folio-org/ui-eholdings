import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useProviderPackages = ({ providerId }) => {
  const namespace = useNamespace();
  const ky = useOkapiKy().extend({
    headers: {
      Accept: '*/*',
    },
  });

  const searchParams = {
    count: 100,
    page: 1,
  };

  const { data = {}, isFetching } = useQuery(
    [namespace, searchParams],
    () => ky.get(`eholdings/providers/${providerId}/packages`, { searchParams }).json(),
  );

  return {
    isLoading: isFetching,
    providerPackages: data.data || [],
    totalResults: data.meta?.totalResults,
  };
};

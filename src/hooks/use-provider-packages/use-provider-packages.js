import {
  useCallback,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import queryString from 'qs';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  FIRST_PAGE,
  PAGE_SIZE,
} from '../../constants';

export const useProviderPackages = ({ providerId, searchParams }) => {
  const namespace = useNamespace();
  const ky = useOkapiKy().extend({
    headers: {
      Accept: '*/*',
    },
  });

  const [page, setPage] = useState(FIRST_PAGE);

  const fetchNextPage = useCallback(() => {
    setPage(_page => _page + 1);
  }, []);

  const fetchPreviousPage = useCallback(() => {
    setPage(_page => _page - 1);
  }, []);

  const paramsWithPageAndCount = {
    ...searchParams,
    page,
    count: PAGE_SIZE,
  };

  const { data = {}, isFetching } = useQuery(
    [namespace, paramsWithPageAndCount],
    () => ky.get(`eholdings/providers/${providerId}/packages?${queryString.stringify(paramsWithPageAndCount)}`).json(),
    { keepPreviousData: true },
  );

  return {
    isLoading: isFetching,
    data: data.data || [],
    totalResults: data.meta?.totalResults,
    page,
    pageSize: PAGE_SIZE,
    fetchNextPage,
    fetchPreviousPage,
  };
};

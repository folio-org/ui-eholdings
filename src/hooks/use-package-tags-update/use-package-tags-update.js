import {
  useMutation,
  useQueryClient,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { useBackendResponseErrors } from '../use-backend-response-errors';

export const usePackageTagsUpdate = ({ packageId, onSuccess } = {}) => {
  const [namespace] = useNamespace({ key: 'package' });
  const queryClient = useQueryClient();
  const { onError, errors } = useBackendResponseErrors();

  const ky = useOkapiKy().extend({
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
  });

  const packageIdString = String(packageId);
  const queryKey = [namespace, packageIdString];

  const {
    mutate,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: (json) => {
      return ky.put(`eholdings/packages/${packageIdString}/tags`, { body: JSON.stringify(json) }).json();
    },
    onMutate: async (json) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey);
      const tagList = json?.data?.attributes?.tags?.tagList;

      if (previous?.data && tagList) {
        queryClient.setQueryData(queryKey, {
          ...previous,
          data: {
            ...previous.data,
            attributes: {
              ...previous.data.attributes,
              tags: { tagList },
            },
          },
        });
      }

      return { previous };
    },
    onError: (error, _json, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }

      onError(error);
    },
    onSuccess,
  });

  const updatePackageTags = (data) => mutate({ data });

  return {
    updatePackageTags,
    isLoading,
    isError,
    errors,
  };
};

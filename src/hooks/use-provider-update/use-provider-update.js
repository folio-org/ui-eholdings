import {
  useMutation,
  useQueryClient,
} from 'react-query';
import noop from 'lodash/noop';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { useBackendResponseErrors } from '../use-backend-response-errors';

export const useProviderUpdate = ({ providerId, onSuccess = noop }) => {
  const [namespace] = useNamespace({ key: 'provider' });
  const queryClient = useQueryClient();
  const { onError, errors } = useBackendResponseErrors();

  const ky = useOkapiKy().extend({
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
  });

  const providerIdString = String(providerId);

  const formatValuesIntoProviderData = (values) => {
    const attrs = { ...values };

    return {
      data: {
        id: providerId,
        attributes: attrs,
        type: 'providers',
      },
    };
  };

  const {
    mutate,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: (json) => {
      return ky.put(`eholdings/providers/${providerIdString}`, { body: JSON.stringify(json) }).json();
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: [namespace, providerIdString] });
      onSuccess(res);
    },
    onError,
  });

  const updateProvider = (values) => {
    const data = formatValuesIntoProviderData(values);
    mutate(data);
  };

  return {
    updateProvider,
    isLoading,
    errors,
    isError,
  };
};

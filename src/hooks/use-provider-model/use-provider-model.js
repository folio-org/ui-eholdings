import { useMemo } from 'react';

import { useProvider } from '../use-provider';
import { useProviderUpdate } from '../use-provider-update';

export const useProviderModel = ({
  providerId,
  onUpdateSuccess,
}) => {
  const {
    data,
    isLoading: isProviderLoading,
    isLoaded: isProviderLoaded,
    isError: isFetchError,
    errors: fetchErrors,
  } = useProvider({ providerId });
  const {
    updateProvider,
    isLoading: isUpdateLoading,
    isError: isUpdateError,
    errors: updateErrors,
  } = useProviderUpdate({ providerId, onSuccess: onUpdateSuccess });

  const model = useMemo(() => ({
    ...data,
    isLoading: isProviderLoading,
    isLoaded: isProviderLoaded && !isFetchError,
    request: {
      isPending: isProviderLoading,
      isRejected: isFetchError,
      errors: fetchErrors,
    },
    update: {
      isPending: isUpdateLoading,
      isRejected: isUpdateError,
      errors: updateErrors,
    },
  }), [data, fetchErrors, isFetchError, isProviderLoading, isProviderLoaded, isUpdateError, isUpdateLoading, updateErrors]);

  return {
    model,
    updateProvider,
  };
};

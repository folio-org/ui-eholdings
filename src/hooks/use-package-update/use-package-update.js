import {
  useMutation,
  useQueryClient,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { useBackendResponseErrors } from '../use-backend-response-errors';
import { serializePackageAttributes } from '../../utils/serialize-package';

export const usePackageUpdate = ({ packageId, onSuccess }) => {
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

  const formatValuesIntoPackageData = (values) => {
    const attrs = serializePackageAttributes(values);

    return {
      data: {
        id: packageId,
        attributes: attrs,
        type: 'packages',
      },
    };
  };

  const {
    mutate,
    mutateAsync,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: (json) => {
      return ky.put(`eholdings/packages/${packageIdString}`, { body: JSON.stringify(json) }).json();
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: [namespace, packageIdString] });
      onSuccess(res);
    },
    onError,
  });

  const updatePackage = (values) => {
    const data = formatValuesIntoPackageData(values);
    mutate(data);
  };

  const updatePackageAsync = (values) => {
    const data = formatValuesIntoPackageData(values);

    return mutateAsync(data);
  };

  return {
    updatePackage,
    updatePackageAsync,
    isLoading,
    errors,
    isError,
  };
};

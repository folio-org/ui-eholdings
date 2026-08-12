import { useState } from 'react';
import {
  useMutation,
  useQueryClient,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { dayjs } from '@folio/stripes/components';

import { serializePackageAttributes } from '../../utils/serialize-package';

export const usePackageUpdate = ({ packageId, onSuccess }) => {
  const [namespace] = useNamespace({ key: 'package' });
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState([]);

  const ky = useOkapiKy().extend({
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
  });

  const packageIdString = String(packageId);

  const formatValuesIntoPackageData = (values) => {
    const attrs = serializePackageAttributes(values);

    if (values?.customCoverages?.[0]) {
      attrs.customCoverage = {
        beginCoverage: !values.customCoverages[0].beginCoverage ? '' :
          dayjs.utc(values.customCoverages[0].beginCoverage).format('YYYY-MM-DD'),
        endCoverage: !values.customCoverages[0].endCoverage ? '' :
          dayjs.utc(values.customCoverages[0].endCoverage).format('YYYY-MM-DD')
      };
    }

    // only send altName property of form fields, and filter out any empty fields, if present
    attrs.customAltNames = values.customAltNames
      ?.map(altNameObj => ({
        altName: altNameObj.altName,
      }))
      .filter(({ altName }) => altName);

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
  });

  const updatePackage = (values) => {
    const data = formatValuesIntoPackageData(values);
    mutate(data);
  };

  return {
    updatePackage,
    isLoading,
    errors,
    isError,
  };
};

import { useState } from 'react';
import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { dayjs } from '@folio/stripes/components';

const usePackageCreate = ({ onSuccess }) => {
  const [errors, setErrors] = useState([]);

  const ky = useOkapiKy().extend({
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
  });

  const formatValuesIntoPackageData = (values) => {
    const attrs = {};

    if (values?.customCoverages?.[0]) {
      attrs.customCoverage = {
        beginCoverage: !values.customCoverages[0].beginCoverage ? '' :
          dayjs.utc(values.customCoverages[0].beginCoverage).format('YYYY-MM-DD'),
        endCoverage: !values.customCoverages[0].endCoverage ? '' :
          dayjs.utc(values.customCoverages[0].endCoverage).format('YYYY-MM-DD')
      };
    }

    if ('name' in values) {
      attrs.name = values.name;
    }

    if ('contentType' in values) {
      attrs.contentType = values.contentType;
    }

    attrs.accessTypeId = values.accessTypeId;

    return {
      data: {
        attributes: attrs,
        type: 'packages',
      },
    };
  };

  const {
    mutate,
    isLoading,
  } = useMutation({
    mutationFn: (json) => {
      return ky.post('eholdings/packages', { body: JSON.stringify(json) })
        .json()
        .then(res => {
          onSuccess(res);
        })
        .catch(({ response }) => {
          response.json().then(body => {
            // for some reason `error` property of the mutation object is not being set
            // returning or throwing an error doesn't set it, so we'll just resort to having a separate
            // state for errors
            setErrors(body.errors);
          });
        });
    },
  });

  const createPackage = (values) => {
    const data = formatValuesIntoPackageData(values);
    mutate(data);
  };

  return {
    createPackage,
    isLoading,
    errors,
  };
};

export { usePackageCreate };

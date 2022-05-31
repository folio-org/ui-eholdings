import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useExportPackageTitle = ({
  onError,
  onSuccess,
}) => {
  const ky = useOkapiKy();

  const customOptions = {
    onError,
    onSuccess,
  };

  const { mutate } = useMutation({
    mutationFn: (json) => {
      return ky.post('data-export-spring/jobs', { json });
    },
    ...customOptions,
  });

  const doExport = (data) => {
    mutate({
      type: 'E_HOLDINGS',
      exportTypeSpecificParameters: {
        eHoldingsExportConfig: {
          recordId: data.recordId,
          recordType: data.recordType,
          packageFields: data.packageFields,
          titleFields: data.titleFields,
        },
      },
    });
  };

  return {
    doExport,
  };
};

export default useExportPackageTitle;

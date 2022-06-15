import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useExportPackageTitle = ({
  onError,
  onSuccess,
}) => {
  const ky = useOkapiKy();

  const { mutate } = useMutation({
    mutationFn: (json) => {
      return ky.post('data-export-spring/jobs', { json })
        .json()
        .then(res => {
          onSuccess(res);
        })
        .catch(e => {
          onError(e);
        });
    },
  });

  const doExport = (data) => {
    mutate({
      type: 'E_HOLDINGS',
      exportTypeSpecificParameters: {
        eHoldingsExportConfig: data,
      },
    });
  };

  return {
    doExport,
  };
};

export default useExportPackageTitle;

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useStripes } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';

import qs from 'qs';
import saveAs from 'file-saver';

const EXPORT_TITLES_FILE_FORMAT = 'csv';

const useFetchExportTitlesFromPackage = ({
  packageName,
  packageId,
  ...params
}) => {
  const { okapi } = useStripes();
  const [isLoading, setIsLoading] = useState(false);
  const calloutRef = useRef();

  const queryString = qs.stringify(params, { addQueryPrefix: true });
  const url = `${okapi.url}/eholdings/packages/${packageId}/resources/costperuse/export${queryString}`;

  const headers = {
    'X-Okapi-Tenant': okapi.tenant,
    'X-Okapi-Token': okapi.token,
    'Content-Type': 'application/json',
  };

  const saveReport = reportData => {
    const blob = new Blob([reportData], { type: EXPORT_TITLES_FILE_FORMAT });
    const fileName = `${packageName}_Usage.${EXPORT_TITLES_FILE_FORMAT}`;

    saveAs(blob, fileName);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const calloutId = calloutRef.current.sendCallout({
      type: 'success',
      message: <FormattedMessage id='ui-eholdings.usageConsolidation.summary.exportTitles.progress' />,
    });

    try {
      const response = await fetch(url, { headers });

      if (response.status === 504) {
        throw new Error('timeout');
      }

      if (response.status >= 400) {
        throw new Error('service');
      }

      const text = await response.text();

      saveReport(text);

      calloutRef.current.sendCallout({
        type: 'success',
        message: <FormattedMessage id='ui-eholdings.usageConsolidation.summary.exportTitles.success' />,
      });
    } catch (error) {
      calloutRef.current.removeCallout(calloutId);
      calloutRef.current.sendCallout({
        type: 'error',
        message: <FormattedMessage id={`ui-eholdings.usageConsolidation.summary.exportTitles.error.${error.message}`} />,
      });
    }

    setIsLoading(false);
  });

  useEffect(() => {
    if (isLoading) {
      fetchData();
    }
  }, [isLoading, fetchData]);

  return [{ calloutRef }, setIsLoading];
};

export default useFetchExportTitlesFromPackage;

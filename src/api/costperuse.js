import queryString from 'query-string';

import {
  getHeaders,
  doRequest,
  createUrl,
} from './common';

const formatParametersForBackend = (filterData) => {
  return queryString.stringify({
    platform: filterData.platformType,
    fiscalYear: filterData.year,
  });
};

const getPackageCostPerUseUrl = (packageId, filterData) => {
  return `/eholdings/packages/${packageId}/costperuse?${formatParametersForBackend(filterData)}`;
};


export default {
  getPackageCostPerUse: (okapi, packageId, filterData) => {
    const method = 'GET';
    const url = createUrl(okapi.url, getPackageCostPerUseUrl(packageId, filterData));

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
};

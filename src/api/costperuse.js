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

const getCostPerUseUrl = (listType, id, filterData) => {
  return `/eholdings/${listType}/${id}/costperuse?${formatParametersForBackend(filterData)}`;
};

export default {
  getCostPerUse: (okapi, listType, id, filterData) => {
    const method = 'GET';
    const url = createUrl(okapi.url, getCostPerUseUrl(listType, id, filterData));

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  getPackageTitlesCostPerUse: (okapi, id, filterData) => {
    const method = 'GET';
  }
};

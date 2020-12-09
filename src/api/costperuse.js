import queryString from 'query-string';
import {
  pick,
  omit,
} from 'lodash';

import {
  getHeaders,
  doRequest,
  createUrl,
} from './common';

const formatParametersForBackend = (filterData) => {
  const ucParamsKeys = ['platformType', 'year'];
  const ucParams = pick(filterData, ucParamsKeys);
  const rest = omit(filterData, ucParamsKeys);

  return queryString.stringify({
    platform: ucParams.platformType,
    fiscalYear: ucParams.year,
    ...rest,
  });
};

const getCostPerUseUrl = (listType, id, filterData) => {
  return `/eholdings/${listType}/${id}/costperuse?${formatParametersForBackend(filterData)}`;
};

const getPackageTitlesCostPerUseUrl = (id, filterData) => {
  const parameters = {
    order: 'desc',
    sort: 'usage',
    ...filterData,
  };

  return `/eholdings/packages/${id}/resources/costperuse?${formatParametersForBackend(parameters)}`;
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
    const url = createUrl(okapi.url, getPackageTitlesCostPerUseUrl(id, filterData));

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
};

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
import { sortOrders } from '../constants';
import {
  DEFAULT_SUMMARY_TABLE_COLUMNS,
} from '../features/usage-consolidation-accordion/summary-table/column-properties';

const formatParametersForBackend = (parameters) => {
  const ucParamsKeys = ['platformType', 'year'];
  const ucParams = pick(parameters, ucParamsKeys);
  const rest = omit(parameters, ucParamsKeys); // sort and paging parameters

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
    order: sortOrders.desc.name,
    sort: DEFAULT_SUMMARY_TABLE_COLUMNS.USAGE,
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

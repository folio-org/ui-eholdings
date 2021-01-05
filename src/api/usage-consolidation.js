import {
  getHeaders,
  doRequest,
  createUrl,
} from './common';

const API_URL = '/eholdings/uc?metrictype=true';
const getApiUrl = credentialId => {
  return credentialId ? `/eholdings/kb-credentials/${credentialId}/uc` : API_URL;
};

export default {
  getUsageConsolidation: (okapi, credentialId) => {
    const method = 'GET';
    const url = createUrl(okapi.url, getApiUrl(credentialId));

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  postUsageConsolidation: (okapi, credentialId, data) => {
    const method = 'POST';
    const url = `${okapi.url}${getApiUrl(credentialId)}`;

    const params = {
      method,
      body: JSON.stringify(data),
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  patchUsageConsolidation: (okapi, credentialId, data) => {
    const method = 'PATCH';
    const url = `${okapi.url}${getApiUrl(credentialId)}`;

    const params = {
      method,
      body: JSON.stringify(data),
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
};

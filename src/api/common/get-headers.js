
/**
 * Helper for creating headers when making a request
 * @param {String} method - request method
 * @param {String} state.okapi.tenant - the Okapi tenant
 * @param {String} state.okapi.token - the Okapi user token
 * @param {String} url - the request url
 * @returns {Object} headers for a new request
 */
export default function (method, okapi, url) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Okapi-Tenant': okapi.tenant,
    'X-Okapi-Token': okapi.token
  };

  if (method === 'PUT' || method === 'POST') {
    if (url.includes('eholdings')) {
      headers['Content-Type'] = 'application/vnd.api+json';
    }
  }

  return headers;
}

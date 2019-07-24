
/**
 * Helper for creating headers when making a request
 * @param {String} method - request method
 * @param {String} state.okapi.tenant - the Okapi tenant
 * @param {String} state.okapi.token - the Okapi user token
 * @param {String} url - the request url
 * @returns {Object} headers for a new request
 */
export default function getHeaders(method, { okapi }, url) {
  let contentType = 'application/json';
  const headers = {
    'X-Okapi-Tenant': okapi.tenant,
    'X-Okapi-Token': okapi.token
  };

  if (method === 'PUT' || method === 'POST') {
    if (url.includes('eholdings')) {
      contentType = 'application/vnd.api+json';
    }
    headers['Content-Type'] = contentType;
  }

  return headers;
}

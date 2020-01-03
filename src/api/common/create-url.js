/**
 * Helper for creating the url
 * @param {String} baseUrl the base url
 * @param {String} apiUrl the API url
 * @param {Object} searchParams search parameters
 * @returns {Object} object with url parameters
 */
export default function createUrl(baseUrl, apiUrl, searchParams) {
  const url = new URL(`${baseUrl}${apiUrl}`);

  if (searchParams) {
    Object.keys(searchParams).forEach((paramName) => {
      url.searchParams.append(paramName, searchParams[paramName]);
    });
  }

  return url;
}

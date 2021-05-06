import queryString from 'querystring';

import packageTitlesApi from '../package-titles';
import {
  doRequest,
  getHeaders,
} from '../common';

jest.mock('../common', () => ({
  doRequest: jest.fn(),
  getHeaders: jest.fn(() => 'headers'),
}));

describe('packageTitlesApi', () => {
  describe('getCollection', () => {
    const method = 'GET';
    const okapi = { url: 'test' };
    const packageId = '123';
    const params = {
      count: 100,
      page: 1,
    };

    const url = `${okapi.url}/eholdings/packages/${packageId}/resources?${queryString.stringify(params)}`;

    it('should handle getHeaders action', () => {
      packageTitlesApi.getCollection(okapi, packageId, params);

      expect(getHeaders).toHaveBeenCalledWith(method, okapi, url);
    });

    it('should handle doRequest action', () => {
      packageTitlesApi.getCollection(okapi, packageId, params);

      expect(doRequest).toHaveBeenCalledWith(url, { method, headers: 'headers' });
    });
  });
});

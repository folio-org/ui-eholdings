import queryString from 'querystring';

import providerPackagesApi from '../provider-packages';
import {
  doRequest,
  getHeaders,
} from '../common';

jest.mock('../common', () => ({
  doRequest: jest.fn(),
  getHeaders: jest.fn(() => 'headers'),
}));

describe('providerPackagesApi', () => {
  describe('getCollection', () => {
    const method = 'GET';
    const okapi = { url: 'test' };
    const providerId = '123';
    const params = {
      count: 100,
      page: 1,
    };

    const url = `${okapi.url}/eholdings/providers/${providerId}/packages?${queryString.stringify(params)}`;

    it('should handle getHeaders action', () => {
      providerPackagesApi.getCollection(okapi, providerId, params);

      expect(getHeaders).toHaveBeenCalledWith(method, okapi, url);
    });

    it('should handle doRequest action', () => {
      providerPackagesApi.getCollection(okapi, providerId, params);

      expect(doRequest).toHaveBeenCalledWith(url, { method, headers: 'headers' });
    });
  });
});

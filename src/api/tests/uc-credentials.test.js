import { cleanup } from '@folio/jest-config-stripes/testing-library/react';

import ucCredentialsApi from '../uc-credentials';
import {
  doRequest,
  getHeaders,
} from '../common';

jest.mock('../common', () => ({
  doRequest: jest.fn(),
  getHeaders: jest.fn(() => 'headers'),
}));

describe('ucCredentialsApi', () => {
  const API_URL = '/eholdings/uc-credentials';
  const okapi = { url: 'test' };
  const url = `${okapi.url}${API_URL}`;

  afterEach(cleanup);

  describe('getUcCredentials', () => {
    const method = 'GET';

    it('should handle getHeaders action', () => {
      ucCredentialsApi.getUcCredentials(okapi);

      expect(getHeaders).toHaveBeenCalledWith(method, okapi, url);
    });

    it('should handle doRequest action', () => {
      ucCredentialsApi.getUcCredentials(okapi);

      expect(doRequest).toHaveBeenCalledWith(url, { method, headers: 'headers' });
    });
  });

  describe('getUcCredentialsClientId', () => {
    const method = 'GET';

    it('should handle getHeaders action', () => {
      ucCredentialsApi.getUcCredentialsClientId(okapi);

      expect(getHeaders).toHaveBeenCalledWith(method, okapi, url);
    });

    it('should handle doRequest action', () => {
      ucCredentialsApi.getUcCredentialsClientId(okapi);

      expect(doRequest).toHaveBeenCalledWith(url, { method, headers: 'headers' });
    });
  });

  describe('getUcCredentialsClientSecret', () => {
    const method = 'GET';

    it('should handle getHeaders action', () => {
      ucCredentialsApi.getUcCredentialsClientSecret(okapi);

      expect(getHeaders).toHaveBeenCalledWith(method, okapi, url);
    });

    it('should handle doRequest action', () => {
      ucCredentialsApi.getUcCredentialsClientSecret(okapi);

      expect(doRequest).toHaveBeenCalledWith(url, { method, headers: 'headers' });
    });
  });

  describe('updateUcCredentials', () => {
    const method = 'PUT';
    const data = { data: 'data' };

    it('should handle getHeaders action', () => {
      ucCredentialsApi.updateUcCredentials(okapi, data);

      expect(getHeaders).toHaveBeenCalledWith(method, okapi, url);
    });

    it('should handle doRequest action', () => {
      ucCredentialsApi.updateUcCredentials(okapi, data);

      expect(doRequest).toHaveBeenCalledWith(url, {
        method,
        headers: 'headers',
        body: JSON.stringify(data),
      });
    });
  });
});

import { TestScheduler } from 'rxjs/testing';

import createGetProviderPackagesEpic from '../get-provider-packages';

import {
  GET_PROVIDER_PACKAGES,
  GET_PROVIDER_PACKAGES_SUCCESS,
  GET_PROVIDER_PACKAGES_FAILURE,
} from '../../actions';

describe('(epic) getProviderPackages', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  const state$ = {
    getState: () => {
      return {
        okapi: {
          url: 'https://folio-snapshot',
          tenant: 'diku',
          token: 'token',
        },
      };
    },
  };

  it('should handle successful data fetching', () => {
    const data = ['item1', 'item2'];
    const meta = { totalResults: 2 };

    const action$ = testScheduler.createHotObservable('-a', {
      a: {
        type: GET_PROVIDER_PACKAGES,
        payload: 'providerId',
      },
    });

    const dependencies = {
      providerPackagesApi: {
        getCollection: () => testScheduler.createColdObservable('--a', {
          a: { data, meta },
        }),
      },
    };

    const output$ = createGetProviderPackagesEpic(dependencies)(action$, state$);

    testScheduler.expectObservable(output$).toBe('---a', {
      a: {
        type: GET_PROVIDER_PACKAGES_SUCCESS,
        payload: {
          data,
          totalResults: meta.totalResults,
        },
      },
    });

    testScheduler.flush();
  });

  it('should handle errors', () => {
    const action$ = testScheduler.createHotObservable('-a', {
      a: {
        type: GET_PROVIDER_PACKAGES,
        payload: 'providerId',
      },
    });

    const dependencies = {
      providerPackagesApi: {
        getCollection: () => testScheduler.createColdObservable('--#', null, { errors: ['error'] }),
      },
    };

    const output$ = createGetProviderPackagesEpic(dependencies)(action$, state$);

    testScheduler.expectObservable(output$).toBe('---a', {
      a: {
        type: GET_PROVIDER_PACKAGES_FAILURE,
        payload: { errors: ['error'] },
      },
    });

    testScheduler.flush();
  });
});

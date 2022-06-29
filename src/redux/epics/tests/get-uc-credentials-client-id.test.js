import { TestScheduler } from 'rxjs/testing';

import createGetUcCredentialsClientIdEpic from '../get-uc-credentials-client-id';

import {
  GET_UC_CREDENTIALS_CLIENT_ID,
  GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS,
  GET_UC_CREDENTIALS_CLIENT_ID_FAILURE,
} from '../../actions';

describe('(epic) getUcCredentialsClientId', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  const state$ = {
    value: {
      okapi: {
        url: 'https://folio-snapshot',
        tenant: 'diku',
        token: 'token',
      },
    },
  };

  it('should handle successful data fetching', () => {
    const data = { clientId: 'client-id' };

    const action$ = testScheduler.createHotObservable('-a', {
      a: { type: GET_UC_CREDENTIALS_CLIENT_ID },
    });

    const dependencies = {
      ucCredentialsApi: {
        getUcCredentialsClientId: () => testScheduler.createColdObservable('--a', {
          a: data,
        }),
      },
    };

    const output$ = createGetUcCredentialsClientIdEpic(dependencies)(action$, state$);

    testScheduler.expectObservable(output$).toBe('---a', {
      a: {
        type: GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS,
        payload: data.clientId,
      },
    });

    testScheduler.flush();
  });

  it('should handle errors', () => {
    const action$ = testScheduler.createHotObservable('-a', {
      a: { type: GET_UC_CREDENTIALS_CLIENT_ID },
    });

    const dependencies = {
      ucCredentialsApi: {
        getUcCredentialsClientId: () => testScheduler.createColdObservable('--#', null, { errors: ['error'] }),
      },
    };

    const output$ = createGetUcCredentialsClientIdEpic(dependencies)(action$, state$);

    testScheduler.expectObservable(output$).toBe('---a', {
      a: {
        type: GET_UC_CREDENTIALS_CLIENT_ID_FAILURE,
        payload: { errors: ['error'] },
      },
    });

    testScheduler.flush();
  });
});

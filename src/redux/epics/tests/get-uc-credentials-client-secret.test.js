import { TestScheduler } from 'rxjs/testing';

import createGetUcCredentialsClientSecretEpic from '../get-uc-credentials-client-secret';

import {
  GET_UC_CREDENTIALS_CLIENT_SECRET,
  GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS,
  GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE,
} from '../../actions';

describe('(epic) getUcCredentialsClientSecret', () => {
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
    const data = { clientSecret: 'client-secret' };

    const action$ = testScheduler.createHotObservable('-a', {
      a: { type: GET_UC_CREDENTIALS_CLIENT_SECRET },
    });

    const dependencies = {
      ucCredentialsApi: {
        getUcCredentialsClientSecret: () => testScheduler.createColdObservable('--a', {
          a: data,
        }),
      },
    };

    const output$ = createGetUcCredentialsClientSecretEpic(dependencies)(action$, state$);

    testScheduler.expectObservable(output$).toBe('---a', {
      a: {
        type: GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS,
        payload: data.clientSecret,
      },
    });

    testScheduler.flush();
  });

  it('should handle errors', () => {
    const action$ = testScheduler.createHotObservable('-a', {
      a: { type: GET_UC_CREDENTIALS_CLIENT_SECRET },
    });

    const dependencies = {
      ucCredentialsApi: {
        getUcCredentialsClientSecret: () => testScheduler.createColdObservable('--#', null, { errors: ['error'] }),
      },
    };

    const output$ = createGetUcCredentialsClientSecretEpic(dependencies)(action$, state$);

    testScheduler.expectObservable(output$).toBe('---a', {
      a: {
        type: GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE,
        payload: { errors: ['error'] },
      },
    });

    testScheduler.flush();
  });
});

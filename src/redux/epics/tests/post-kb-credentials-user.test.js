import { TestScheduler } from 'rxjs/testing';

import createPostKbCredentialsUserEpic from '../post-kb-credentials-user';

import {
  POST_KB_CREDENTIALS_USER,
  POST_KB_CREDENTIALS_USER_FAILURE,
  GET_KB_CREDENTIALS_USERS,
} from '../../actions';

describe('(epic) postKbCredentialsUser', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  const state$ = {
    items: [],
    value: {
      okapi: 'okapi',
    },
  };

  it('should handle successful data fetching', () => {
    const payload = {
      credentialsId: 'kb-id',
      userData: {
        data: {
          credentialsId: 'kb-id',
          id: 'user-id',
        },
      },
    };

    const action$ = testScheduler.createHotObservable('-a', {
      a: {
        type: POST_KB_CREDENTIALS_USER,
        payload,
      },
    });

    const dependencies = {
      kbCredentialsUsersApi: {
        assignUser: () => testScheduler.createColdObservable('--a', {
          a: { payload },
        }),
      },
    };

    const output$ = createPostKbCredentialsUserEpic(dependencies)(action$, state$);

    testScheduler.expectObservable(output$).toBe('---a', {
      a: {
        type: GET_KB_CREDENTIALS_USERS,
        payload: {
          credentialsId: 'kb-id',
        },
      },
    });

    testScheduler.flush();
  });

  it('should handle errors', () => {
    const payload = {
      credentialsId: 'kb-id',
      userData: {
        data:{
          credentialsId: 'kb-id',
          id: 'user-id',
        },
      },
    };

    const action$ = testScheduler.createHotObservable('-a', {
      a: {
        type: POST_KB_CREDENTIALS_USER,
        payload,
      },
    });

    const dependencies = {
      kbCredentialsUsersApi: {
        assignUser: () => testScheduler.createColdObservable('--#', null, { errors: 'error' }),
      },
    };

    const output$ = createPostKbCredentialsUserEpic(dependencies)(action$, state$);

    testScheduler.expectObservable(output$).toBe('---a', {
      a: {
        type: POST_KB_CREDENTIALS_USER_FAILURE,
        payload: 'error',
      },
    });

    testScheduler.flush();
  });
});

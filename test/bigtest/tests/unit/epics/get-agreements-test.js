/* global describe, it */
import { expect } from 'chai';

import { TestScheduler } from 'rxjs/Rx';

import { createGetAgreementsEpic } from '../../../../../src/redux/epics';

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).deep.equal(expected);
});

describe('(epic) getAgreements', () => {
  it('handles successful data fetching', () => {
    const action$ = testScheduler.createHotObservable('-a', {
      a: { type: 'GET_AGREEMENTS', payload: { refId: '123' } }
    });

    const response = { body: ['item1', 'item2'] };

    const state$ = {
      getState: () => {
        return {
          okapi: {
            url: 'https://folio-snapshot',
            tenant: 'diku',
            token: 'token',
          }
        };
      }
    };

    const dependencies = {
      agreementsApi: {
        getAll: () => testScheduler.createColdObservable('--a', {
          a: response.body
        })
      }
    };

    const output$ = createGetAgreementsEpic(dependencies)(action$, state$);

    testScheduler.expectObservable(output$).toBe('---a', {
      a: {
        type: 'GET_AGREEMENTS_SUCCESS',
        payload: {
          items: response.body,
        }
      }
    });

    testScheduler.flush();
  });
});

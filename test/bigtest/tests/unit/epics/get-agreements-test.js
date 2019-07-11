/* global describe, it */
import { expect } from 'chai';

import { TestScheduler } from 'rxjs/testing';

import { createGetAgreementsEpic } from '../../../../../src/redux/epics';

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).deep.equal(expected);
});

describe('(epic) getAgreements', () => {
  it('handles successful data fetching', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const action$ = hot('-a', {
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
          getAll: () => cold('--a', {
            a: response.body
          })
        }
      };

      const output$ = createGetAgreementsEpic(dependencies)(action$, state$);

      expectObservable(output$).toBe('---a', {
        a: {
          type: 'GET_AGREEMENTS_SUCCESS',
          payload: {
            items: response.body,
          }
        }
      });
    });
  });
});

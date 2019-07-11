/* global describe, it */
import { expect } from 'chai';

import { TestScheduler } from 'rxjs/testing';

import { createAttachAgreementEpic } from '../../../../../src/redux/epics';

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).deep.equal(expected);
});

describe('(epic) attachAgreement', () => {
  it('triggers action to add agreement and passes agreement data', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const action$ = hot('-a', {
        a: { type: 'ATTACH_AGREEMENT' }
      });

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

      const agreement = {
        id: 'id',
        agreementStatus: 'status',
        name: 'name',
        startDate: 'start date',
      };

      const dependencies = {
        agreementsApi: {
          attachAgreement: () => cold('--a', {
            a: agreement
          })
        }
      };

      const output$ = createAttachAgreementEpic(dependencies)(action$, state$);

      expectObservable(output$).toBe('---a', {
        a: {
          type: 'ADD_AGREEMENT',
          payload: agreement
        }
      });
    });
  });
});

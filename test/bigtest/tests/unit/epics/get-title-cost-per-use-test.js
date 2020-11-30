/* global describe, it, beforeEach */
import { expect } from 'chai';

import { TestScheduler } from 'rxjs/Rx';

import { createGetTitleCostPerUseEpic } from '../../../../../src/redux/epics';
import {
  GET_TITLE_COST_PER_USE,
  GET_TITLE_COST_PER_USE_SUCCESS,
  GET_TITLE_COST_PER_USE_FAILURE,
} from '../../../../../src/redux/actions';

describe'(epic) getTitleCostPerUse', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).deep.equal(expected);
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
    const response = {
      body: {
        attributes: {
          analysis: {
            holdingsSummary: [{
              cost: 200,
            }]
          },
        }
      },
    };

    const action$ = testScheduler.createHotObservable('-a', {
      a: {
        type: GET_TITLE_COST_PER_USE,
        payload: {
          titleId: '123',
          filterData: {
            platformType: 'publisher',
          },
        },
      },
    });

    const dependencies = {
      costPerUseApi: {
        getTitleCostPerUse: () => testScheduler.createColdObservable('--a', {
          a: response.body,
        }),
      },
    };

    const output$ = createGetTitleCostPerUseEpic(dependencies)(action$, state$);

    testScheduler.expectObservable(output$).toBe('---a', {
      a: {
        type: GET_TITLE_COST_PER_USE_SUCCESS,
        payload: {
          attributes: {
            analysis: {
              holdingsSummary: [{
                cost: 200,
              }],
            },
          },
        },
      },
    });

    testScheduler.flush();
  });

  it('should handle errors', () => {
    const action$ = testScheduler.createHotObservable('-a', {
      a: {
        type: GET_TITLE_COST_PER_USE,
        payload: {
          titleId: '123',
          filterData: {
            platformType: 'publisher',
          },
        },
      },
    });

    const dependencies = {
      costPerUseApi: {
        getTitleCostPerUse: () => testScheduler.createColdObservable('--#', null, 'Error messages'),
      },
    };

    const output$ = createGetTitleCostPerUseEpic(dependencies)(action$, state$);

    testScheduler.expectObservable(output$).toBe('---a', {
      a: {
        type: GET_TITLE_COST_PER_USE_FAILURE,
        payload: { errors: 'Error messages' },
      },
    });

    testScheduler.flush();
  });
});

/* global describe, it */
import { expect } from 'chai';

import {
  GET_AGREEMENTS,
  getAgreements,
} from '../../../../../src/redux/actions/get-agreements';

describe('(action) getAgreements', () => {
  it('should create an action to get agreements', () => {
    const payload = { testProp: 'prop' };
    const expectedAction = {
      type: GET_AGREEMENTS,
      payload: {
        testProp: 'prop',
        isLoading: true,
      },
    };

    expect(getAgreements(payload)).to.deep.equal(expectedAction);
  });
});

/* global describe, it */
import { expect } from 'chai';

import {
  GET_AGREEMENTS_SUCCESS,
  getAgreementsSuccess,
} from '../../../../../src/redux/actions/get-agreements-success';

describe('(action) getAgreementsSuccess', () => {
  it('should create an action to handle get agreements success', () => {
    const payload = { testProp: 'prop' };
    const expectedAction = {
      type: GET_AGREEMENTS_SUCCESS,
      payload: {
        testProp: 'prop',
        isLoading: false,
      },
    };

    expect(getAgreementsSuccess(payload)).to.deep.equal(expectedAction);
  });
});

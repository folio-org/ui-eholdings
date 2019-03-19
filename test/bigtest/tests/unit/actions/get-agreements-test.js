/* global describe, it */
import { expect } from 'chai';

import {
  GET_AGREEMENTS,
  getAgreements,
} from '../../../../../src/redux/actions/get-agreements';

describe('(action) getAgreements', () => {
  it('should create an action to get agreements', () => {
    const referenceId = 'referenceId';
    const expectedAction = {
      type: GET_AGREEMENTS,
      payload: {
        referenceId,
        isLoading: true,
      },
    };

    expect(getAgreements(referenceId)).to.deep.equal(expectedAction);
  });
});

/* global describe, it */
import { expect } from 'chai';

import {
  GET_AGREEMENTS,
  getAgreements,
} from '../../../../../src/redux/actions/get-agreements';

describe('(action) getAgreements', () => {
  it('should create an action to get agreements', () => {
    const refId = 'referenceId';
    const expectedAction = {
      type: GET_AGREEMENTS,
      payload: { refId },
    };

    expect(getAgreements(refId)).to.deep.equal(expectedAction);
  });
});

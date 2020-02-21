/* global describe, it */
import { expect } from 'chai';

import {
  ATTACH_ACCESS_TYPE_FAILURE,
  attachAccessTypeFailure,
} from '../../../../../src/redux/actions/attach-access-type-failure';

describe('(action) attachAccessTypeFailure', () => {
  it('should create an action to handle attach access type failure', () => {
    const payload = 'payload';
    const expectedAction = {
      type: ATTACH_ACCESS_TYPE_FAILURE,
      payload,
    };

    expect(attachAccessTypeFailure(payload)).to.deep.equal(expectedAction);
  });
});

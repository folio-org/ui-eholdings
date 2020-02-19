/* global describe, it */
import { expect } from 'chai';

import {
  UPDATE_ACCESS_TYPE_FAILURE,
  updateAccessTypeFailure,
} from '../../../../../src/redux/actions/update-access-type-failure';

describe('(action) updateAccessTypeFailure', () => {
  it('should create an action to handle update access type failure', () => {
    const payload = 'payload';
    const expectedAction = {
      type: UPDATE_ACCESS_TYPE_FAILURE,
      payload,
    };

    expect(updateAccessTypeFailure(payload)).to.deep.equal(expectedAction);
  });
});

/* global describe, it */
import { expect } from 'chai';

import {
  UPDATE_ACCESS_TYPE_SUCCESS,
  updateAccessTypeSuccess,
} from '../../../../../src/redux/actions/update-access-type-success';

describe('(action) updateAccessTypeSuccess', () => {
  it('should create an action to handle update access type success', () => {
    const payload = 'payload';
    const expectedAction = {
      type: UPDATE_ACCESS_TYPE_SUCCESS,
      payload,
    };

    expect(updateAccessTypeSuccess(payload)).to.deep.equal(expectedAction);
  });
});

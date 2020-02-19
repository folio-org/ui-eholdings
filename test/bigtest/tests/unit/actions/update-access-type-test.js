/* global describe, it */
import { expect } from 'chai';

import {
  UPDATE_ACCESS_TYPE,
  updateAccessType,
} from '../../../../../src/redux/actions/update-access-type';

describe('(action) updateAccessType', () => {
  it('should create an action to update access type', () => {
    const payload = 'payload';
    const expectedAction = {
      type: UPDATE_ACCESS_TYPE,
      payload,
    };

    expect(updateAccessType(payload)).to.deep.equal(expectedAction);
  });
});

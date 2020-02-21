/* global describe, it */
import { expect } from 'chai';

import {
  ADD_ACCESS_TYPE,
  addAccessType,
} from '../../../../../src/redux/actions/add-access-type';

describe('(action) addAccessType', () => {
  it('should create an action to add an access type', () => {
    const payload = 'payload';
    const expectedAction = {
      type: ADD_ACCESS_TYPE,
      payload,
    };

    expect(addAccessType(payload)).to.deep.equal(expectedAction);
  });
});

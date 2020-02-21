/* global describe, it */
import { expect } from 'chai';

import {
  ATTACH_ACCESS_TYPE,
  attachAccessType,
} from '../../../../../src/redux/actions/attach-access-type';

describe('(action) attachAccessType', () => {
  it('should create an action to attach access type', () => {
    const payload = 'payload';
    const expectedAction = {
      type: ATTACH_ACCESS_TYPE,
      payload,
    };

    expect(attachAccessType(payload)).to.deep.equal(expectedAction);
  });
});

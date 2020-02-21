/* global describe, it */
import { expect } from 'chai';

import {
  ATTACH_ACCESS_TYPE_SUCCESS,
  attachAccessTypeSuccess,
} from '../../../../../src/redux/actions/attach-access-type-success';

describe('(action) attachAccessTypeSuccess', () => {
  it('should create an action to handle attach access type success', () => {
    const expectedAction = {
      type: ATTACH_ACCESS_TYPE_SUCCESS,
    };

    expect(attachAccessTypeSuccess()).to.deep.equal(expectedAction);
  });
});

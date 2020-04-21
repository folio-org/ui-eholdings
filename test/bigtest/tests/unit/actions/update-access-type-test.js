/* global describe, it */
import { expect } from 'chai';

import {
  UPDATE_ACCESS_TYPE,
  updateAccessType,
} from '../../../../../src/redux/actions/update-access-type';

describe('(action) updateAccessType', () => {
  it('should create an action to update access type', () => {
    const accessType = 'payload';
    const credentialId = '1';

    const expectedAction = {
      type: UPDATE_ACCESS_TYPE,
      payload: {
        accessType,
        credentialId,
      },
    };

    expect(updateAccessType(accessType, credentialId)).to.deep.equal(expectedAction);
  });
});

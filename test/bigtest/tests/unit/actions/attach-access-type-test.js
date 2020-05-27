/* global describe, it */
import { expect } from 'chai';

import {
  ATTACH_ACCESS_TYPE,
  attachAccessType,
} from '../../../../../src/redux/actions/attach-access-type';

describe('(action) attachAccessType', () => {
  it('should create an action to attach access type', () => {
    const accessType = 'payload';
    const credentialId = '1';

    const expectedAction = {
      type: ATTACH_ACCESS_TYPE,
      payload: {
        accessType,
        credentialId,
      },
    };

    expect(attachAccessType(accessType, credentialId)).to.deep.equal(expectedAction);
  });
});

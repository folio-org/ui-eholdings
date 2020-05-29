/* global describe, it */
import { expect } from 'chai';

import {
  DELETE_ACCESS_TYPE,
  deleteAccessType,
} from '../../../../../src/redux/actions/delete-access-type';

describe('(action) deleteAccessType', () => {
  it('should create an action to delete access type', () => {
    const accessType = { id: '1' };
    const credentialId = '1';

    const expectedAction = {
      type: DELETE_ACCESS_TYPE,
      payload: { accessType, credentialId },
    };

    expect(deleteAccessType(accessType, credentialId)).to.deep.equal(expectedAction);
  });
});

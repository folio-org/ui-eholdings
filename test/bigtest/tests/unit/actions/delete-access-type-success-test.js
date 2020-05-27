/* global describe, it */
import { expect } from 'chai';

import {
  DELETE_ACCESS_TYPE_SUCCESS,
  deleteAccessTypeSuccess,
} from '../../../../../src/redux/actions/delete-access-type-success';

describe('(action) deleteAccessTypeSuccess', () => {
  it('should create an action to delete access type success', () => {
    const id = 'id';
    const credentialId = 'credId';
    const expectedAction = {
      type: DELETE_ACCESS_TYPE_SUCCESS,
      payload: { id, credentialId },
    };

    expect(deleteAccessTypeSuccess({ id, credentialId })).to.deep.equal(expectedAction);
  });
});

/* global describe, it */
import { expect } from 'chai';

import {
  DELETE_ACCESS_TYPE,
  deleteAccessType,
} from '../../../../../src/redux/actions/delete-access-type';

describe('(action) deleteAccessType', () => {
  it('should create an action to delete access type', () => {
    const id = 'id';
    const expectedAction = {
      type: DELETE_ACCESS_TYPE,
      payload: { id },
    };

    expect(deleteAccessType(id)).to.deep.equal(expectedAction);
  });
});

/* global describe, it */
import { expect } from 'chai';

import {
  DELETE_ACCESS_TYPE_FAILURE,
  deleteAccessTypeFailure,
} from '../../../../../src/redux/actions/delete-access-type-failure';

describe('(action) deleteAccessTypeFailure', () => {
  it('should create an action to handle delete access type failure', () => {
    const errors = 'error';
    const accessTypeId = '1';
    const expectedAction = {
      type: DELETE_ACCESS_TYPE_FAILURE,
      payload: {
        errors,
        accessTypeId,
      },
    };

    expect(deleteAccessTypeFailure({ errors, accessTypeId })).to.deep.equal(expectedAction);
  });
});

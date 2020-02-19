/* global describe, it */
import { expect } from 'chai';

import {
  GET_ACCESS_TYPES_SUCCESS,
  getAccessTypesSuccess,
} from '../../../../../src/redux/actions/get-access-types-success';

describe('(action) getAccessTypesSuccess', () => {
  it('should create an action to handle get access types success', () => {
    const payload = ['accessType1', 'accessType2'];
    const expectedAction = {
      type: GET_ACCESS_TYPES_SUCCESS,
      payload: {
        accessTypes: payload,
      },
    };

    expect(getAccessTypesSuccess(payload)).to.deep.equal(expectedAction);
  });
});

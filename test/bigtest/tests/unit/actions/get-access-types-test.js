/* global describe, it */
import { expect } from 'chai';

import {
  GET_ACCESS_TYPES,
  getAccessTypes,
} from '../../../../../src/redux/actions/get-access-types';

describe('(action) getAccessTypes', () => {
  it('should create an action to get access types', () => {
    const credentialId = '1';
    const expectedAction = {
      type: GET_ACCESS_TYPES,
      payload: credentialId,
    };

    expect(getAccessTypes(credentialId)).to.deep.equal(expectedAction);
  });
});

/* global describe, it */
import { expect } from 'chai';

import {
  GET_KB_CREDENTIALS_KEY,
  getKbCredentialsKey,
} from '../../../../../../src/redux/actions';

describe('(action) getKbCredentialsKey', () => {
  it('should create an action to get kb credentials key', () => {
    const credentialId = '1';
    const expectedAction = {
      type: GET_KB_CREDENTIALS_KEY,
      payload: credentialId,
    };

    expect(getKbCredentialsKey(credentialId)).to.deep.equal(expectedAction);
  });
});

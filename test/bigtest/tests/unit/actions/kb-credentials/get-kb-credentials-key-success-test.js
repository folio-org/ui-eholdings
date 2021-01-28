/* global describe, it */
import { expect } from 'chai';

import {
  GET_KB_CREDENTIALS_KEY_SUCCESS,
  getKbCredentialsKeySuccess,
} from '../../../../../../src/redux/actions';

describe('(action) getKbCredentialsKeySuccess', () => {
  it('should create an action to handle get kb credentials key success', () => {
    const data = { apiKey: 'somekey' };

    const expectedAction = {
      type: GET_KB_CREDENTIALS_KEY_SUCCESS,
      payload: data,
    };

    expect(getKbCredentialsKeySuccess(data)).to.deep.equal(expectedAction);
  });
});

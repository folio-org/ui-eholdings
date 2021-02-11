/* global describe, it */
import { expect } from 'chai';

import {
  GET_KB_CREDENTIALS_KEY_FAILURE,
  getKbCredentialsKeyFailure,
} from '../../../../../../src/redux/actions';

describe('(action) getKbCredentialsKeyFailure', () => {
  it('should create an action to handle get kb credentials key failure', () => {
    const errors = { errors: 'some errors' };

    const expectedAction = {
      type: GET_KB_CREDENTIALS_KEY_FAILURE,
      payload: errors.errors,
    };

    expect(getKbCredentialsKeyFailure(errors)).to.deep.equal(expectedAction);
  });
});

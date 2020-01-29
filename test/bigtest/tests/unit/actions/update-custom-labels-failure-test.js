/* global describe, it */
import { expect } from 'chai';

import {
  UPDATE_CUSTOM_LABELS_FAILURE,
  updateCustomLabelsFailure,
} from '../../../../../src/redux/actions/update-custom-labels-failure';

describe('(action) updateCustomLabelsFailure', () => {
  it('should create an action to handle update custom labels failure', () => {
    const payload = 'payload';
    const expectedAction = {
      type: UPDATE_CUSTOM_LABELS_FAILURE,
      payload,
    };

    expect(updateCustomLabelsFailure(payload)).to.deep.equal(expectedAction);
  });
});

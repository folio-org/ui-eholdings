/* global describe, it */
import { expect } from 'chai';

import {
  UPDATE_CUSTOM_LABELS,
  updateCustomLabels,
} from '../../../../../src/redux/actions/update-custom-labels';

describe('(action) updateCustomLabels', () => {
  it('should create an action to update custom labels', () => {
    const payload = 'payload';
    const expectedAction = {
      type: UPDATE_CUSTOM_LABELS,
      payload,
    };

    expect(updateCustomLabels(payload)).to.deep.equal(expectedAction);
  });
});

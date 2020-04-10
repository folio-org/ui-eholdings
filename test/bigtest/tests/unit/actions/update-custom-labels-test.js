/* global describe, it */
import { expect } from 'chai';

import {
  UPDATE_CUSTOM_LABELS,
  updateCustomLabels,
} from '../../../../../src/redux/actions/update-custom-labels';

describe('(action) updateCustomLabels', () => {
  it('should create an action to update custom labels', () => {
    const customLabels = 'payload';
    const credentialId = '1';
    const expectedAction = {
      type: UPDATE_CUSTOM_LABELS,
      payload: {
        customLabels,
        credentialId,
      },
    };

    expect(updateCustomLabels(customLabels, credentialId)).to.deep.equal(expectedAction);
  });
});

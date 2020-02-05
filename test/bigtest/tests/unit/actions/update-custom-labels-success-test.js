/* global describe, it */
import { expect } from 'chai';

import {
  UPDATE_CUSTOM_LABELS_SUCCESS,
  updateCustomLabelsSuccess,
} from '../../../../../src/redux/actions/update-custom-labels-success';

describe('(action) updateCustomLabelsSuccess', () => {
  it('should create an action to handle update custom labels success', () => {
    const expectedAction = {
      type: UPDATE_CUSTOM_LABELS_SUCCESS,
    };

    expect(updateCustomLabelsSuccess()).to.deep.equal(expectedAction);
  });
});

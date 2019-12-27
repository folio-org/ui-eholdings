/* global describe, it */
import { expect } from 'chai';

import {
  GET_CUSTOM_LABELS,
  getCustomLabels,
} from '../../../../../src/redux/actions/get-custom-labels';

describe('(action) getCustomLabels', () => {
  it('should create an action to get custom labels', () => {
    const expectedAction = {
      type: GET_CUSTOM_LABELS,
    };

    expect(getCustomLabels()).to.deep.equal(expectedAction);
  });
});

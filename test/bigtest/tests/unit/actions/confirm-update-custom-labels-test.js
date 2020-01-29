/* global describe, it */
import { expect } from 'chai';

import {
  CONFIRM_UPDATE_CUSTOM_LABELS,
  confirmUpdateCustomLabels,
} from '../../../../../src/redux/actions/confirm-update-custom-labels';

describe('(action) confirmUpdateCustomLabels', () => {
  it('should create an action to confirm update custom labels', () => {
    const expectedAction = {
      type: CONFIRM_UPDATE_CUSTOM_LABELS,
    };

    expect(confirmUpdateCustomLabels()).to.deep.equal(expectedAction);
  });
});

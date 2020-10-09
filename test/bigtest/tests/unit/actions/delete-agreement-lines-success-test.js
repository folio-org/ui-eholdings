/* global describe, it */
import { expect } from 'chai';

import {
  DELETE_AGREEMENT_LINES_SUCCESS,
  deleteAgreementLinesSuccess,
} from '../../../../../src/redux/actions/delete-agreement-lines-success';

describe('(action) deleteAgreementLinesSuccess', () => {
  it('should create an action to handle delete agreement lines success', () => {
    const expectedAction = { type: DELETE_AGREEMENT_LINES_SUCCESS };

    expect(deleteAgreementLinesSuccess()).to.deep.equal(expectedAction);
  });
});

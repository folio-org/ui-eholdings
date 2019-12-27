/* global describe, it */
import { expect } from 'chai';

import {
  GET_CUSTOM_LABELS_SUCCESS,
  getCustomLabelsSuccess,
} from '../../../../../src/redux/actions/get-custom-labels-success';

describe('(action) getCustomLabelsSuccess', () => {
  it('should create an action to handle get custom labels success', () => {
    const payload = {
      data: [{
        '1': {
          type: 'customLabel',
          attributes: {
            id: 1,
            displayLabel: 'simple label',
            displayOnFullTextFinder: true,
            displayOnPublicationFinder: false,
          }
        }
      }],
    };
    const expectedAction = {
      type: GET_CUSTOM_LABELS_SUCCESS,
      payload: {
        customLabels: payload,
      },
    };

    expect(getCustomLabelsSuccess(payload)).to.deep.equal(expectedAction);
  });
});

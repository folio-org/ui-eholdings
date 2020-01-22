/* global describe, it */
import { expect } from 'chai';

import { selectCustomLabels } from '../../../../../src/redux/selectors';

describe('(selector) selectCustomLabels', () => {
  it('should select custom labels', () => {
    const store = {
      eholdings: {
        data: {
          customLabels: 'custom labels',
        },
      },
    };

    expect(selectCustomLabels(store)).to.equal('custom labels');
  });
});

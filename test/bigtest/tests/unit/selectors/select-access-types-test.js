/* global describe, it */
import { expect } from 'chai';

import { selectPropFromData } from '../../../../../src/redux/selectors';

describe('(selector) selectPropFromData', () => {
  it('should select prop from data', () => {
    const store = {
      eholdings: {
        data: { type: 'type' },
      },
    };

    expect(selectPropFromData(store, 'type')).to.equal('type');
  });
});

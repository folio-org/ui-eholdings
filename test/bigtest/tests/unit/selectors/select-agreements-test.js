/* global describe, it */
import { expect } from 'chai';

import selectAgreements from '../../../../../src/redux/selectors/select-agreements';

describe('(selector) selectAgreements', () => {
  it('should select agreements', () => {
    const store = {
      eholdings: {
        data: {
          agreements: 'agreements',
        },
      },
    };

    expect(selectAgreements(store)).to.equal('agreements');
  });
});

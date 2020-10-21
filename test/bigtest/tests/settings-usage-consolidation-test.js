import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { axe } from '../helpers/setup-application';
import wait from '../helpers/wait';

describe('With list of root proxies available to a customer', () => {
  setupApplication();

  let a11yResults = null;

  describe('when visiting the settings usage consolidation form', () => {
    beforeEach(async function () {
      this.visit('/settings/eholdings/2/usage-consolidation');
      await wait(1000);
    });

    describe('waiting for axe to run', () => {
      beforeEach(async () => {
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });
    });
  });
});

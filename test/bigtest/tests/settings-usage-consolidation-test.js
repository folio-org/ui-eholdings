import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import SettingsUsageConsolidationPage from '../interactors/settings-usage-consolidation';
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

    
    it('should open settings usage consolidation page', () => {
      expect(SettingsUsageConsolidationPage.isPresent).to.be.true;
    });

    it('should show usage consolidation id field', () => {
      expect(SettingsUsageConsolidationPage.usageConsolidationIdField.isPresent).to.be.true;
    });
/*
    describe.skip('when fill usage consolidation id field with empty value', () => {
      beforeEach(() => {
        SettingsUsageConsolidationPage.usageConsolidationIdField.fill('');
      });

      expect(SettingsUsageConsolidationPage.usageConsolidationIdField.value()).to.be.true;
    });*/
  });
});

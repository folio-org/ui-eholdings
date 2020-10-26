import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import SettingsUsageConsolidationPage from '../interactors/settings-usage-consolidation';
import setupApplication, { axe } from '../helpers/setup-application';
import wait from '../helpers/wait';

describe.only('With usage consolidation available to a customer', () => {
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

    it('should show usage consolidation start month field', () => {
      expect(SettingsUsageConsolidationPage.usageConsolidationStartMonthField.isPresent).to.be.true;
    });

    it('should show correct saved start month value', () => {
      expect(SettingsUsageConsolidationPage.usageConsolidationStartMonthField.value).to.equal('mar');
    });
  });

  describe('when usage consolidation has not been set up', () => {
    beforeEach(async function () {
      this.server.get('/kb-credentials/:credId/uc', () => ({}));

      this.visit('/settings/eholdings/2/usage-consolidation');
      await wait(1000);
    });

    it('should show default value as January', () => {
      expect(SettingsUsageConsolidationPage.usageConsolidationStartMonthField.value).to.equal('jan');
    });
  });
});

import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import SettingsUsageConsolidationPage from '../interactors/settings-usage-consolidation';
import setupApplication, { axe } from '../helpers/setup-application';
import wait from '../helpers/wait';

describe('With usage consolidation available to a customer', () => {
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

    describe('usage condolidation id show hide password', () => {
      it('should show show/hide button', () => {
        expect(SettingsUsageConsolidationPage.usageConsolidationIdField.isShowHideButtonPresent).to.be.true;
      });

      it('should show encrypted key by default', () => {
        expect(SettingsUsageConsolidationPage.usageConsolidationIdField.customerKeyInput.type).to.equal('password');
      });

      describe('when clicking on show key button', () => {
        beforeEach(async () => {
          await SettingsUsageConsolidationPage.usageConsolidationIdField.clickShowHideButton();
        });

        it('should show value of key', () => {
          expect(SettingsUsageConsolidationPage.usageConsolidationIdField.customerKeyInput.type).to.equal('text');
        });
      });
    });

    it('should show usage consolidation start month field', () => {
      expect(SettingsUsageConsolidationPage.usageConsolidationStartMonthField.isPresent).to.be.true;
    });

    it('should show correct saved start month value', () => {
      expect(SettingsUsageConsolidationPage.usageConsolidationStartMonthField.value).to.equal('mar');
    });

    it('should show currency field', () => {
      expect(SettingsUsageConsolidationPage.currencyField.isPresent).to.be.true;
    });

    it('should show correct saved currency value', () => {
      expect(SettingsUsageConsolidationPage.currencyField.value).to.equal('USD');
    });

    it('should show usage consolidation platform type field', () => {
      expect(SettingsUsageConsolidationPage.usageConsolidationPlatformTypeField.isPresent).to.be.true;
    });

    it('should show correct saved platform type value', () => {
      expect(SettingsUsageConsolidationPage.usageConsolidationPlatformTypeField.value).to.equal('publisher');
    });

    describe('when changing start month value', () => {
      beforeEach(() => {
        return SettingsUsageConsolidationPage.usageConsolidationStartMonthField.selectAndBlur('April');
      });

      it('should enable the save button', () => {
        expect(SettingsUsageConsolidationPage.saveButtonDisabled).to.be.false;
      });

      describe('and clicking save', () => {
        beforeEach(() => {
          return SettingsUsageConsolidationPage.save();
        });

        it('should save the new value', () => {
          expect(SettingsUsageConsolidationPage.usageConsolidationStartMonthField.value).to.equal('apr');
        });

        it('should disable the save button', () => {
          expect(SettingsUsageConsolidationPage.saveButtonDisabled).to.be.true;
        });
      });
    });

    describe('when changing platform type value', () => {
      beforeEach(() => {
        return SettingsUsageConsolidationPage.usageConsolidationPlatformTypeField.selectAndBlur('Non-publisher platforms only');
      });

      it('should enable the save button', () => {
        expect(SettingsUsageConsolidationPage.saveButtonDisabled).to.be.false;
      });

      describe('and clicking save', () => {
        beforeEach(() => {
          return SettingsUsageConsolidationPage.save();
        });

        it('should save the new value', () => {
          expect(SettingsUsageConsolidationPage.usageConsolidationPlatformTypeField.value).to.equal('nonPublisher');
        });

        it('should disable the save button', () => {
          expect(SettingsUsageConsolidationPage.saveButtonDisabled).to.be.true;
        });
      });
    });
  });

  describe('when usage consolidation key could not be loaded', () => {
    beforeEach(async function () {
      this.server.get('/kb-credentials/:credId/uc/key', 500);

      this.visit('/settings/eholdings/2/usage-consolidation');
      await wait(1000);
    });

    it('should not show show/hide button', () => {
      expect(SettingsUsageConsolidationPage.usageConsolidationIdField.isShowHideButtonPresent).to.be.false;
    });
  });

  describe('when usage consolidation has not been set up', () => {
    beforeEach(async function () {
      this.server.get('/kb-credentials/:credId/uc', () => ({}));

      this.visit('/settings/eholdings/2/usage-consolidation');
      await wait(1000);
    });

    it('should show default start month value as January', () => {
      expect(SettingsUsageConsolidationPage.usageConsolidationStartMonthField.value).to.equal('jan');
    });

    it('should show default value for currency field', () => {
      expect(SettingsUsageConsolidationPage.currencyField.value).to.equal('');
    });

    it('should show default platform type value as All', () => {
      expect(SettingsUsageConsolidationPage.usageConsolidationPlatformTypeField.value).to.equal('all');
    });
  });
});

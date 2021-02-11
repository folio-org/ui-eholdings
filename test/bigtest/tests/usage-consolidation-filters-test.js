import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { axe } from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';

describe('Usage Consolidation filters', () => {
  setupApplication();
  let provider,
    providerPackage;

  const currentYear = new Date().getFullYear();
  let a11yResults = null;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: true,
      titleCount: 5
    });
  });

  describe('visiting the package details page', () => {
    beforeEach(async function () {
      this.visit(`/eholdings/packages/${providerPackage.id}`);
      await PackageShowPage.usageConsolidation.whenLoaded();
    });

    describe('waiting for axe to run', () => {
      beforeEach(async () => {
        await PackageShowPage.whenLoaded();
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });
    });

    it('should set current year as default value', () => {
      expect(PackageShowPage.usageConsolidation.filters.yearDropdown.value).to.equal(currentYear.toString());
    });

    it('should show last 5 years as values for Year filter', () => {
      const years = [
        currentYear,
        currentYear - 1,
        currentYear - 2,
        currentYear - 3,
        currentYear - 4,
      ].map(year => year.toString());
      const expectedValues = PackageShowPage
        .usageConsolidation
        .filters
        .yearDropdownOptions()
        .map(option => option.value);

      expect(expectedValues).to.eql(years);
    });
  });
});

import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { axe } from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';

describe('PackageShowUsageConsolidation', () => {
  setupApplication();
  let provider;
  let providerPackage;
  let resources;

  let a11yResults = null;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', 'withCustomCoverage', 'withProxy', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: false,
      titleCount: 5,
      packageType: 'Complete',
    });

    resources = this.server.schema.where('resource', { packageId: providerPackage.id }).models;

    const urgentTag = this.server.create('tag', {
      tagList: ['urgent'],
    }).toJSON();

    resources.forEach(resource => {
      resource.tags = urgentTag;
      resource.save();
    });
  });

  describe('when Usage Consolidation has not been set up in Settings', () => {
    beforeEach(function () {
      this.server.get('/uc', 404);
      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('should not show Usage Consolidation accordion', () => {
      expect(PackageShowPage.usageConsolidation.isAccordionPresent).to.be.false;
    });
  });

  describe('when Usage Consolidation has been set up in Settings', () => {
    beforeEach(function () {
      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('should show Usage Consolidation accordion', () => {
      expect(PackageShowPage.usageConsolidation.isAccordionPresent).to.be.true;
    });

    it('should show accordion collapsed by default', () => {
      expect(PackageShowPage.usageConsolidation.accordion.isOpen).to.be.false;
    });

    describe('when clicking on accordion header', () => {
      beforeEach(async () => {
        await PackageShowPage.usageConsolidation.accordion.clickHeader();
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

      it('should open the accordion', () => {
        expect(PackageShowPage.usageConsolidation.accordion.isOpen).to.be.true;
      });
    });
  });

  describe('visiting the package details page', () => {
    beforeEach(async function () {
      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });
  });
});

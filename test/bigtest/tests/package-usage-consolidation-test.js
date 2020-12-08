import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { axe } from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
// import usageConsolidationInfoPopoverTests from './usage-consolidation-info-popover';

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

    // TODO:: uncomment current tests after folio/stripes 5.1.0 will be available
    // usageConsolidationInfoPopoverTests(PackageShowPage.usageConsolidation.infoPopover);

    describe('when clicking on accordion header', () => {
      beforeEach(async () => {
        await PackageShowPage.usageConsolidation.accordion.clickHeader();
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          await PackageShowPage.whenLoaded();
          a11yResults = await axe.run();
        });

        it.only('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('should open the accordion', () => {
        expect(PackageShowPage.usageConsolidation.accordion.isOpen).to.be.true;
      });

      describe('when clicking View', () => {
        beforeEach(async () => {
          await PackageShowPage.usageConsolidation.filters.clickView();
          await PackageShowPage.usageConsolidation.content.whenLoaded();
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

        it('should show Summary table', () => {
          expect(PackageShowPage.usageConsolidation.content.summaryTable.isPresent).to.be.true;
        });

        it('should show Cost data in correct format', () => {
          expect(PackageShowPage.usageConsolidation.content.summaryTable.rows(0).cells(0).content).to.equal('$1,201 (USD)');
        });

        it('should show CostPerUse data in correct format', () => {
          expect(PackageShowPage.usageConsolidation.content.summaryTable.rows(0).cells(2).content).to.equal('$0.03 (USD)');
        });
      });
    });
  });

  describe('when Usage Consolidation request has failed', () => {
    beforeEach(async function () {
      this.server.get('/packages/:packageId/costperuse', {
        errors: [{
          title: 'There was an error',
        }],
      }, 404);

      this.visit(`/eholdings/packages/${providerPackage.id}`);
      await PackageShowPage.usageConsolidation.accordion.clickHeader();
      await PackageShowPage.usageConsolidation.filters.clickView();
      await PackageShowPage.usageConsolidation.content.whenLoaded();
    });

    it('should show an error message', () => {
      expect(PackageShowPage.usageConsolidation.content.isUsageConsolidationErrorPresent);
    });

    it('should show correct error text', () => {
      expect(PackageShowPage.usageConsolidation.content.usageConsolidationErrorText).to.equal('Unable to provide summary information');
    });
  });

  describe('when Usage Consolidation data is incomplete', () => {
    beforeEach(async function () {
      this.server.get('/packages/:packageId/costperuse', () => ({
        'packageId': '58-473',
        'type': 'packageCostPerUse',
        'attributes': {
          'analysis': {
            'publisherPlatforms': {
              'cost': 1201,
              'usage': null,
              'costPerUse': 0.0334,
            }
          },
          'parameters': {
            'startMonth': 'jan',
            'currency': 'USD',
          },
        },
      }));

      this.visit(`/eholdings/packages/${providerPackage.id}`);
      await PackageShowPage.usageConsolidation.accordion.clickHeader();
      await PackageShowPage.usageConsolidation.filters.clickView();
      await PackageShowPage.usageConsolidation.content.whenLoaded();
    });

    it('should show Summary table', () => {
      expect(PackageShowPage.usageConsolidation.content.summaryTable.isPresent).to.be.true;
    });

    it('should show Usage in correct format', () => {
      expect(PackageShowPage.usageConsolidation.content.summaryTable.rows(0).cells(1).content).to.equal('-');
    });
  });

  describe('when some Usage Consolidation data has value 0', () => {
    beforeEach(async function () {
      this.server.get('/packages/:packageId/costperuse', () => ({
        'packageId': '58-473',
        'type': 'packageCostPerUse',
        'attributes': {
          'analysis': {
            'publisherPlatforms': {
              'cost': 1201,
              'usage': 0,
              'costPerUse': 0.0334,
            }
          },
          'parameters': {
            'startMonth': 'jan',
            'currency': 'USD',
          },
        },
      }));

      this.visit(`/eholdings/packages/${providerPackage.id}`);
      await PackageShowPage.usageConsolidation.accordion.clickHeader();
      await PackageShowPage.usageConsolidation.filters.clickView();
      await PackageShowPage.usageConsolidation.content.whenLoaded();
    });

    it('should show Summary table', () => {
      expect(PackageShowPage.usageConsolidation.content.summaryTable.isPresent).to.be.true;
    });

    it('should show Usage in correct format', () => {
      expect(PackageShowPage.usageConsolidation.content.summaryTable.rows(0).cells(1).content).to.equal('0');
    });
  });

  describe('when Usage Consolidation data is not available', () => {
    beforeEach(async function () {
      this.server.get('/packages/:packageId/costperuse', () => ({
        'packageId': '58-473',
        'type': 'packageCostPerUse',
        'attributes': {
          'analysis': {
            'publisherPlatforms': {
              'cost': 0,
              'usage': 0,
              'costPerUse': 0,
            }
          },
          'parameters': {
            'startMonth': 'jan',
            'currency': 'USD',
          },
        },
      }));

      this.visit(`/eholdings/packages/${providerPackage.id}`);
      await PackageShowPage.usageConsolidation.accordion.clickHeader();
      await PackageShowPage.usageConsolidation.filters.clickView();
      await PackageShowPage.usageConsolidation.content.whenLoaded();
    });

    it('should show an error message', () => {
      expect(PackageShowPage.usageConsolidation.content.isUsageConsolidationErrorPresent);
    });

    it('should show correct error text', () => {
      expect(PackageShowPage.usageConsolidation.content.usageConsolidationErrorText)
        .to.equal(`This package contains no cost or usage data for ${new Date().getFullYear()}`);
    });
  });

  describe('when Package Titles cost per use request has failed', () => {
    beforeEach(async function () {
      this.server.get('/packages/:packageId/titles/costperuse', {
        errors: [{
          title: 'There was an error',
        }],
      }, 404);

      this.visit(`/eholdings/packages/${providerPackage.id}`);
      await PackageShowPage.usageConsolidation.accordion.clickHeader();
      await PackageShowPage.usageConsolidation.filters.clickView();
      await PackageShowPage.usageConsolidation.content.whenLoaded();
    });

    // TODO: write tests
    it.only('should show error message', () => {
      
    });
  });

  describe('when Package Titles cost per use data is incomplete', () => {
    beforeEach(async function () {
      this.server.get('/packages/:packageId/titles/costperuse', () => ({
        'type': 'packageTitleCostPerUse',
        'attributes': {
          'resources': [
            {
              'id': '1-473-356',
              'attributes': {
                'cost': 141.8806,
                'usage': null,
                'costPerUse': 5.456946153846153,
              }
            },
          ],
        },
      }));

      this.visit(`/eholdings/packages/${providerPackage.id}`);
      await PackageShowPage.usageConsolidation.accordion.clickHeader();
      await PackageShowPage.usageConsolidation.filters.clickView();
      await PackageShowPage.usageConsolidation.content.whenLoaded();
    });

    it('should show Titles table', () => {
      expect(PackageShowPage.usageConsolidation.content.titlesTable.isPresent).to.be.true;
    });

    it('should show Usage in correct format', () => {
      expect(PackageShowPage.usageConsolidation.content.titlesTable.rows(0).cells(3).content).to.equal('-');
    });
  });

  describe('when Package Titles cost per use data is not available', () => {
    // TODO: describe case
  });
});

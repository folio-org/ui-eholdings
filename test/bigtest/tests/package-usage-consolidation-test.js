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

        it('should not have any a11y issues', () => {
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

        describe('when clicking View titles', () => {
          beforeEach(async () => {
            await PackageShowPage.usageConsolidation.content.actionsDropdown.focusAndOpen();
            await PackageShowPage.usageConsolidation.content.actionsDropdown.menu.items(0).click();
            await PackageShowPage.usageConsolidation.content.whenTitlesLoaded();
          });

          it('should show correct number of rows', () => {
            expect(PackageShowPage.usageConsolidation.content.titlesTable.rows().length).to.equal(4);
          });

          it('should show cost in correct format', () => {
            expect(PackageShowPage.usageConsolidation.content.titlesTable.rows(0).cells(2).content).to.equal('$1.04 (USD)');
          });

          it('should show cost per use in correct format', () => {
            expect(PackageShowPage.usageConsolidation.content.titlesTable.rows(0).cells(4).content).to.equal('$0.01 (USD)');
          });

          it('should show percent of usage in correct format', () => {
            expect(PackageShowPage.usageConsolidation.content.titlesTable.rows(3).cells(5).content).to.equal('-');
          });

          describe('when clicking on a header column', () => {
            beforeEach(async function () {
              this.server.get('/packages/:id/resources/costperuse', () => ({
                'data': [{
                  'resourceId': '58-473-1230757',
                  'type': 'resourceCostPerUseItem',
                  'attributes': {
                    'name': 'AAHE-ERIC/Higher Education Research Report',
                    'publicationType': 'Journal',
                    'percent': 15.6,
                    'usage': 0
                  }
                }, {
                  'resourceId': '58-473-491',
                  'type': 'resourceCostPerUseItem',
                  'attributes': {
                    'name': 'About Campus',
                    'publicationType': 'Journal',
                    'percent': 15.4,
                    'usage': 23
                  }
                }, {
                  'resourceId': '58-473-356',
                  'type': 'resourceCostPerUseItem',
                  'attributes': {
                    'name': 'Abacus',
                    'publicationType': 'Journal',
                    'percent': 0.08677172462134165,
                    'cost': 1.042165,
                    'usage': 127,
                    'costPerUse': 0.008206023622047243
                  }
                }, {
                  'resourceId': '58-473-1230759',
                  'type': 'resourceCostPerUseItem',
                  'attributes': {
                    'name': 'AAHE-ERIC/Higher Education Research Report 2',
                    'publicationType': 'Journal',
                    'percent': 0,
                    'usage': 200
                  }
                }],
                'parameters': {
                  'startMonth': 'jan',
                  'currency': 'USD'
                },
                'meta': {
                  'totalResults': 3
                },
                'jsonapi': {
                  'version': '1.0'
                }
              }));

              await PackageShowPage.usageConsolidation.content.titlesTable.headers(3).click();
            });

            it('should change sort order to ascending', () => {
              const expectedUsages = ['0', '23', '127', '200'];

              const usages = PackageShowPage.usageConsolidation.content.titlesTable.rows()
                .map(row => row.cells(3).content);

              expect(usages).to.eql(expectedUsages);
            });
          });
        });

        describe('when clicking Export titles', () => {
          beforeEach(async () => {
            await PackageShowPage.usageConsolidation.content.actionsDropdown.focusAndOpen();
            await PackageShowPage.usageConsolidation.content.actionsDropdown.menu.items(1).click();
            await PackageShowPage.usageConsolidation.content.whenTitlesLoaded();
          });

          it.skip('should show success callout', () => {
            expect(PackageShowPage.usageConsolidation.toast.successCalloutIsPresent).to.be.true;
          });
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
      this.server.get('/packages/:id/resources/costperuse', {
        errors: [{
          title: 'There was an error',
        }],
      }, 404);

      this.visit(`/eholdings/packages/${providerPackage.id}`);
      await PackageShowPage.usageConsolidation.accordion.clickHeader();
      await PackageShowPage.usageConsolidation.filters.clickView();
      await PackageShowPage.usageConsolidation.content.whenLoaded();
      await PackageShowPage.usageConsolidation.content.actionsDropdown.focusAndOpen();
      await PackageShowPage.usageConsolidation.content.actionsDropdown.menu.items(0).click();
    });

    it('should show error message', () => {
      expect(PackageShowPage.usageConsolidation.content.errorToastNotificationPresent).to.be.true;
    });
  });

  describe('when there are more than 100 package titles available', () => {
    beforeEach(async function () {
      this.server.get('/packages/:id/resources/costperuse', (schema, request) => {
        const pageSize = 100;
        const lastPage = 2;

        const page = parseInt(request.queryParams.page, 10) || 1;

        const packageTitles = page === lastPage + 1
          ? []
          : new Array(pageSize).fill(null).map((_, index) => {
            const itemIndex = (page - 1) * pageSize + index + 1;

            return {
              'resourceId': `58-473-${itemIndex}`,
              'type': 'resourceCostPerUseItem',
              'attributes': {
                'name': `Abacus ${itemIndex}`,
                'publicationType': 'Journal',
                'percent': 0.08677172462134165,
                'cost': 1.042165,
                'usage': 127,
                'costPerUse': 0.008206023622047243
              }
            };
          });

        return {
          'data': packageTitles,
          'parameters': {
            'startMonth': 'jan',
            'currency': 'USD'
          },
          'meta': {
            'totalResults': lastPage * pageSize,
          },
          'jsonapi': {
            'version': '1.0'
          }
        };
      });

      this.visit(`/eholdings/packages/${providerPackage.id}`);
      await PackageShowPage.usageConsolidation.accordion.clickHeader();
      await PackageShowPage.usageConsolidation.filters.clickView();
      await PackageShowPage.usageConsolidation.content.whenLoaded();
      await PackageShowPage.usageConsolidation.content.actionsDropdown.focusAndOpen();
      await PackageShowPage.usageConsolidation.content.actionsDropdown.menu.items(0).click();
    });

    it('should show loading indicator', () => {
      expect(PackageShowPage.usageConsolidation.content.isLoadingMessagePresent).to.be.true;
    });

    describe('when titles have loaded', () => {
      beforeEach(async () => {
        await PackageShowPage.usageConsolidation.content.whenTitlesLoaded();
      });

      it('should show Titles table', () => {
        expect(PackageShowPage.usageConsolidation.content.titlesTable.isPresent).to.be.true;
      });

      it('should show correct number of rows', () => {
        expect(PackageShowPage.usageConsolidation.content.titlesTable.rows().length).to.equal(100);
      });

      it('should show Load more button', () => {
        expect(PackageShowPage.usageConsolidation.content.titlesTable.pagingButton.isPresent).to.be.true;
      });

      describe('when clicking Load more', () => {
        beforeEach(async () => {
          await PackageShowPage.usageConsolidation.content.titlesTable.pagingButton.click();
        });

        it('should load more items', () => {
          expect(PackageShowPage.usageConsolidation.content.titlesTable.rows().length).to.equal(200);
        });

        it('should not show load more button', () => {
          expect(PackageShowPage.usageConsolidation.content.titlesTable.pagingButton.isPresent).to.be.false;
        });
      });
    });
  });

  describe('when Package Titles cost per use data is incomplete', () => {
    beforeEach(async function () {
      this.server.get('/packages/:packageId/resources/costperuse', () => ({
        'data': [{
          'id': '1-473-356',
          'attributes': {
            'cost': 141.8806,
            'usage': null,
            'costPerUse': 5.456946153846153,
          }
        }],
        'parameters': {
          'startMonth': 'jan',
          'currency': 'USD'
        },
        'meta': {
          'totalResults': 3
        },
        'jsonapi': {
          'version': '1.0'
        }
      }));

      this.visit(`/eholdings/packages/${providerPackage.id}`);
      await PackageShowPage.usageConsolidation.accordion.clickHeader();
      await PackageShowPage.usageConsolidation.filters.clickView();
      await PackageShowPage.usageConsolidation.content.whenLoaded();
      await PackageShowPage.usageConsolidation.content.actionsDropdown.focusAndOpen();
      await PackageShowPage.usageConsolidation.content.actionsDropdown.menu.items(0).click();
      await PackageShowPage.usageConsolidation.content.whenTitlesLoaded();
    });

    it('should show Titles table', () => {
      expect(PackageShowPage.usageConsolidation.content.titlesTable.isPresent).to.be.true;
    });

    it('should show Usage in correct format', () => {
      expect(PackageShowPage.usageConsolidation.content.titlesTable.rows(0).cells(3).content).to.equal('-');
    });
  });
});

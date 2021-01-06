import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import setupApplication, { axe } from '../helpers/setup-application';
import TitleShowPage from '../interactors/title-show';

describe('TitleShowUsageConsolidation', () => {
  setupApplication();
  let title;

  let a11yResults = null;

  beforeEach(function () {
    title = this.server.create('title', 'withPackages', {
      name: 'Cool Title',
      edition: 'Cool Edition',
      publisherName: 'Cool Publisher',
      publicationType: 'Website'
    });

    title.subjects = [
      this.server.create('subject', { subject: 'Cool Subject 1' }),
      this.server.create('subject', { subject: 'Cool Subject 2' }),
      this.server.create('subject', { subject: 'Cool Subject 3' })
    ].map(m => m.toJSON());

    title.identifiers = [
      this.server.create('identifier', { type: 'ISBN', subtype: 'Print', id: '978-0547928210' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Print', id: '978-0547928203' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Online', id: '978-0547928197' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Empty', id: '978-0547928227' }),
      this.server.create('identifier', { type: 'Mid', subtype: 'someothersubtype', id: 'someothertypeofid' })
    ].map(m => m.toJSON());

    title.contributors = [
      this.server.create('contributor', { type: 'author', contributor: 'Writer, Sally' }),
      this.server.create('contributor', { type: 'author', contributor: 'Wordsmith, Jane' }),
      this.server.create('contributor', { type: 'illustrator', contributor: 'Artist, John' })
    ].map(m => m.toJSON());

    title.save();
  });

  describe('when Usage Consolidation has not been set up in Settings', () => {
    beforeEach(function () {
      this.server.get('/uc', 404);
      this.visit(`/eholdings/titles/${title.id}`);
    });

    it('should not show Usage Consolidation accordion', () => {
      expect(TitleShowPage.usageConsolidationSection.isAccordionPresent).to.be.false;
    });
  });

  describe('when Usage Consolidation has been set up in Settings', () => {
    beforeEach(function () {
      this.visit(`/eholdings/titles/${title.id}`);
    });

    it('should show Usage Consolidation accordion', () => {
      expect(TitleShowPage.usageConsolidationSection.isAccordionPresent).to.be.true;
    });

    it('should show accordion collapsed by default', () => {
      expect(TitleShowPage.usageConsolidationSection.accordion.isOpen).to.be.false;
    });

    describe('when clicking on accordion header', () => {
      beforeEach(async () => {
        await TitleShowPage.usageConsolidationSection.accordion.clickHeader();
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          await TitleShowPage.whenLoaded();
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('should open the accordion', () => {
        expect(TitleShowPage.usageConsolidationSection.accordion.isOpen).to.be.true;
      });

      describe('when clicking View', () => {
        beforeEach(async () => {
          await TitleShowPage.usageConsolidationSection.filters.clickView();
          await TitleShowPage.usageConsolidationSection.content.whenLoaded();
        });

        describe('waiting for axe to run', () => {
          beforeEach(async () => {
            await TitleShowPage.whenLoaded();
            a11yResults = await axe.run();
          });

          it('should not have any a11y issues', () => {
            expect(a11yResults.violations).to.be.empty;
          });
        });

        it('should show Summary table', () => {
          expect(TitleShowPage.usageConsolidationSection.content.summaryTable.isPresent).to.be.true;
        });

        it('should show five columns in Summary table', () => {
          expect(TitleShowPage.usageConsolidationSection.content.summaryTable.columnCount).to.be.equal(5);
        });

        it('should show Cost data in correct format', () => {
          expect(TitleShowPage.usageConsolidationSection.content.summaryTable.rows(1).cells(2).content).to.equal('$1,030.14 (USD)');
        });

        it('should show CostPerUse data in correct format', () => {
          expect(TitleShowPage.usageConsolidationSection.content.summaryTable.rows(1).cells(4).content).to.equal('$50.12 (USD)');
        });

        it('should by default sort rows by Package Name in ascending order', () => {
          const expectedPackageNames = [
            'Agricultural & Environmental Science Database (DRAA)',
            'Wiley Database Model (BIBSAM)',
            'Wiley Online Library Database Model 2019',
            'Wiley Online Library Full Collection 2020',
          ];

          const packageNames = TitleShowPage.usageConsolidationSection.content.summaryTable.rows()
            .map(row => row.cells(0).content);

          expect(packageNames).to.eql(expectedPackageNames);
        });

        describe('when clicking on a header', () => {
          beforeEach(async () => {
            await TitleShowPage.usageConsolidationSection.content.summaryTable.headers(0).click();
          });

          it('should change sort order to descending', () => {
            const expectedPackageNames = [
              'Wiley Online Library Full Collection 2020',
              'Wiley Online Library Database Model 2019',
              'Wiley Database Model (BIBSAM)',
              'Agricultural & Environmental Science Database (DRAA)',
            ];

            const packageNames = TitleShowPage.usageConsolidationSection.content.summaryTable.rows()
              .map(row => row.cells(0).content);

            expect(packageNames).to.eql(expectedPackageNames);
          });
        });

        describe('when sorting by coverages in ascending order', () => {
          beforeEach(async () => {
            await TitleShowPage.usageConsolidationSection.content.summaryTable.headers(1).click();
          });

          it('should show rows in correct order', () => {
            const expectedCoverages = [
              '-',
              '1/1/1997 - Present',
              '1/1/1997 - Present',
              '1/1/2001 - 1/1/2003, 1/1/1998 - 1/1/2000 (full text delay: 10 day(s))',
            ];

            const packageNames = TitleShowPage.usageConsolidationSection.content.summaryTable.rows()
              .map(row => row.cells(1).content);

            expect(packageNames).to.eql(expectedCoverages);
          });
        });
      });
    });
  });

  describe('when Usage Consolidation request has failed', () => {
    beforeEach(async function () {
      this.server.get('/titles/:titleId/costperuse', {
        errors: [{
          title: 'There was an error',
        }],
      }, 404);

      this.visit(`/eholdings/titles/${title.id}`);
      await TitleShowPage.usageConsolidationSection.accordion.clickHeader();
      await TitleShowPage.usageConsolidationSection.filters.clickView();
      await TitleShowPage.usageConsolidationSection.content.whenLoaded();
    });

    it('should show an error message', () => {
      expect(TitleShowPage.usageConsolidationSection.content.isUsageConsolidationErrorPresent);
    });

    it('should show correct error text', () => {
      expect(TitleShowPage.usageConsolidationSection.content.usageConsolidationErrorText).to.equal('Unable to provide summary information');
    });
  });

  describe('when Usage Consolidation data is incomplete', () => {
    beforeEach(async function () {
      this.server.get('/titles/:titleId/costperuse', () => ({
        'titleId': '185972',
        'type': 'titleCostPerUse',
        'attributes': {
          'usage': {
            'platforms': [{
              'name': 'Wiley Online Library',
              'isPublisherPlatform' : true,
              'counts': [2, 6, 0, 3, 6, 2, 1, 2, null, null, null, null],
              'total': 22
            }],
            'totals': {
              'publisher': {
                'counts': [2, 6, 0, 3, 6, 2, 1, 2, null, null, null, null],
                'total': 22
              }
            }
          },
          'analysis' : {
            'holdingsSummary': [{
              'packageId': '58-2121943',
              'packageName': 'Wiley Database Model  (BIBSAM)',
              'coverages': [{
                'beginCoverage': '1998-01-01',
                'endCoverage': '2000-01-01'
              }],
              'embargoPeriod': {
                'embargoValue': 0
              },
              'cost': 0.0,
              'usage': null,
              'costPerUse': 0.0
            }],
          },
          'parameters': {
            'startMonth': 'jan',
            'currency': 'USD',
          },
        }
      }));

      this.visit(`/eholdings/titles/${title.id}`);
      await TitleShowPage.usageConsolidationSection.accordion.clickHeader();
      await TitleShowPage.usageConsolidationSection.filters.clickView();
      await TitleShowPage.usageConsolidationSection.content.whenLoaded();
    });

    it('should show Summary table', () => {
      expect(TitleShowPage.usageConsolidationSection.content.summaryTable.isPresent).to.be.true;
    });

    it('should show Usage in correct format', () => {
      expect(TitleShowPage.usageConsolidationSection.content.summaryTable.rows(0).cells(3).content).to.equal('-');
    });
  });

  describe('when some Usage Consolidation data has value 0', () => {
    beforeEach(async function () {
      this.server.get('/titles/:titleId/costperuse', () => ({
        'titleId': '185972',
        'type': 'titleCostPerUse',
        'attributes': {
          'usage': {
            'platforms': [{
              'name': 'Wiley Online Library',
              'isPublisherPlatform' : true,
              'counts': [2, 6, 0, 3, 6, 2, 1, 2, null, null, null, null],
              'total': 22
            }],
            'totals': {
              'publisher': {
                'counts': [2, 6, 0, 3, 6, 2, 1, 2, null, null, null, null],
                'total': 22
              }
            }
          },
          'analysis' : {
            'holdingsSummary': [{
              'packageId': '58-2121943',
              'packageName': 'Wiley Database Model  (BIBSAM)',
              'coverages': [{
                'beginCoverage': '1998-01-01',
                'endCoverage': '2000-01-01'
              }],
              'embargoPeriod': {
                'embargoValue': 0
              },
              'cost': 10.0,
              'usage': 0,
              'costPerUse': 0.01
            }],
          },
          'parameters': {
            'startMonth': 'jan',
            'currency': 'USD',
          },
        }
      }));

      this.visit(`/eholdings/titles/${title.id}`);
      await TitleShowPage.usageConsolidationSection.accordion.clickHeader();
      await TitleShowPage.usageConsolidationSection.filters.clickView();
      await TitleShowPage.usageConsolidationSection.content.whenLoaded();
    });

    it('should show Summary table', () => {
      expect(TitleShowPage.usageConsolidationSection.content.summaryTable.isPresent).to.be.true;
    });

    it('should show Usage in correct format', () => {
      expect(TitleShowPage.usageConsolidationSection.content.summaryTable.rows(0).cells(3).content).to.equal('0');
    });
  });

  describe('when Usage Consolidation data is not available', () => {
    beforeEach(async function () {
      this.server.get('/titles/:titleId/costperuse', () => ({
        'titleId': '185972',
        'type': 'titleCostPerUse',
        'attributes': {
          'usage': {
            'platforms': [{
              'name': 'Wiley Online Library',
              'isPublisherPlatform' : true,
              'counts': [2, 6, 0, 3, 6, 2, 1, 2, null, null, null, null],
              'total': 22
            }],
            'totals': {
              'publisher': {
                'counts': [2, 6, 0, 3, 6, 2, 1, 2, null, null, null, null],
                'total': 22
              }
            }
          },
          'analysis' : {
            'holdingsSummary': null,
          },
          'parameters': {
            'startMonth': 'jan',
            'currency': 'USD',
          },
        }
      }));

      this.visit(`/eholdings/titles/${title.id}`);
      await TitleShowPage.usageConsolidationSection.accordion.clickHeader();
      await TitleShowPage.usageConsolidationSection.filters.clickView();
      await TitleShowPage.usageConsolidationSection.content.whenLoaded();
    });

    it('should show an error message', () => {
      expect(TitleShowPage.usageConsolidationSection.content.isUsageConsolidationErrorPresent);
    });

    it('should show correct error text', () => {
      expect(TitleShowPage.usageConsolidationSection.content.usageConsolidationErrorText)
        .to.equal(`This title contains no cost or usage data for ${new Date().getFullYear()}`);
    });
  });
});

import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';

describe('Package Show Title Search', function () {
  // some of the beforeEach blocks seem to timeout in CI
  this.timeout(5000);
  setupApplication();
  let provider,
    resources,
    providerPackage;

  beforeEach(async function () {
    provider = await this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = await this.server.create(
      'package',
      'withTitles',
      'withCustomCoverage',
      {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: false,
        titleCount: 3,
        packageType: 'Complete'
      }
    );

    resources = await this.server.schema.where('resource', {
      packageId: providerPackage.id
    }).models;

    await resources[0].title.update({
      name: 'My Title 1',
      publicationType: 'report',
      subjects: [this.server.create('subject', { subject: 'FooBar' }).toJSON()],
    });

    await resources[0].update({
      isSelected: true,
    });

    await resources[0].title.update({
      tags: {
        tagList: ['urgent', 'not urgent']
      }
    });

    await resources[1].title.update({
      name: 'My Title 2',
      publicationType: 'book',
      publisherName: 'The Frontside',
      tags: {
        tagList: ['urgent']
      }
    });

    await resources[1].update({
      isSelected: false
    });

    await resources[2].title.update({
      name: 'SUPER Duper 3',
      publicationType: 'book',
      tags: {
        tagList: ['urgent']
      }
    });

    await resources[2].update({
      isSelected: false
    });
  });

  describe('navigating to package show page to filter titles', () => {
    beforeEach(async function () {
      await this.visit(
        {
          pathname: `/eholdings/packages/${providerPackage.id}`,
          // our internal link component automatically sets the location state
          state: { eholdings: true }
        }
      );
      await PackageShowPage.whenLoaded();
    });

    it('displays the proper title count', () => {
      expect(PackageShowPage.titleList().length).to.equal(3);
    });

    it('has no filters by default', () => {
      expect(PackageShowPage.searchModalBadge.filterText).to.equal('');
    });

    it('displays the number of relevant title records', () => {
      expect(PackageShowPage.searchResultsCount).to.equal('3');
    });

    describe('when the search modal is open', () => {
      beforeEach(async () => {
        await PackageShowPage.clickListSearch();
      });

      it('all filter accordions should be collapsed', () => {
        PackageShowPage.searchModal.filterAccordions().forEach(accordion => {
          expect(accordion.isOpen).to.be.false;
        });
      });

      describe('searching for a title', () => {
        beforeEach(async () => {
          await PackageShowPage.searchModal.searchTitles('My Title');
          await PackageShowPage.searchModal.clickSearch();
        });

        it('properly filters the results', () => {
          expect(PackageShowPage.titleList(0).name).to.equal('My Title 1');
          expect(PackageShowPage.titleList(1).name).to.equal('My Title 2');
        });

        it('has the right amount of titles displayed', () => {
          expect(PackageShowPage.titleList().length).to.equal(2);
        });
      });

      describe('searching for a title with the selected filter', () => {
        beforeEach(async () => {
          await PackageShowPage.searchModal.toggleAccordion('#accordion-toggle-button-filter-titles-selected');
          await PackageShowPage.searchModal.clickFilter('selected', 'true');
          await PackageShowPage.searchModal.clickSearch();
        });

        it('properly filters the results', () => {
          expect(PackageShowPage.titleList().length).to.equal(1);
        });
      });

      describe('searching for a title with the publication type filter', () => {
        beforeEach(async () => {
          await PackageShowPage.searchModal.toggleAccordion('#accordion-toggle-button-filter-titles-type');
          await PackageShowPage.searchModal.clickFilter('type', 'report');
          await PackageShowPage.searchModal.clickSearch();
        });

        it('properly filters to one result', () => {
          expect(PackageShowPage.titleList().length).to.equal(1);
        });

        it('has the right title name', () => {
          expect(PackageShowPage.titleList(0).name).to.equal('My Title 1');
        });
      });

      describe('searching for a title by title publisher filter', () => {
        beforeEach(async () => {
          await PackageShowPage.searchModal.selectSearchField('Publisher');
          await PackageShowPage.searchModal.searchTitles('The Frontside');
          await PackageShowPage.searchModal.clickSearch();
        });

        it('properly filters to one result', () => {
          expect(PackageShowPage.titleList().length).to.equal(1);
        });

        it('has the right title name', () => {
          expect(PackageShowPage.titleList(0).name).to.equal('My Title 2');
        });

        describe('changing the filter to subject', () => {
          beforeEach(async () => {
            await PackageShowPage.clickListSearch();
            await PackageShowPage.searchModal.selectSearchField('Subject');
            await PackageShowPage.searchModal.searchTitles('FooBar');
            await PackageShowPage.searchModal.clickSearch();
          });

          it('properly filters to one result', () => {
            expect(PackageShowPage.titleList().length).to.equal(1);
          });

          it('has the right title name', () => {
            expect(PackageShowPage.titleList(0).name).to.equal('My Title 1');
          });
        });

        describe('resetting the search', () => {
          beforeEach(async () => {
            await PackageShowPage.clickListSearch();
            await PackageShowPage.searchModal.clickResetAll();
          });

          it('properly filters to one result', () => {
            expect(PackageShowPage.titleList().length).to.equal(3);
          });
        });
      });

      describe('after click on tags accordion header', () => {
        beforeEach(async () => {
          await PackageShowPage.searchModal.tagsSection.clickTagHeader();
        });

        it('should expand the accordion', () => {
          expect(PackageShowPage.searchModal.tagsSection.tagsAccordion.isOpen).to.be.true;
        });

        it('search by tags should be disabled', () => {
          expect(PackageShowPage.searchModal.tagsSection.tagsCheckboxIsChecked).to.be.false;
          expect(PackageShowPage.searchModal.tagsSection.tagsMultiselectIsDisabled).to.be.true;
        });

        it('search by query should be enabled', () => {
          expect(PackageShowPage.searchModal.searchFieldIsDisabled).to.be.false;
        });

        it('displays tag filter with empty value by default', () => {
          expect(PackageShowPage.searchModal.tagsSection.tagsSelect.values()).to.deep.equal([]);
        });

        describe('after enabling search by tags', () => {
          beforeEach(async () => {
            await PackageShowPage.searchModal.tagsSection.toggleSearchByTags();
          });

          it('search by tags should be enabled', () => {
            expect(PackageShowPage.searchModal.tagsSection.tagsCheckboxIsChecked).to.be.true;
            expect(PackageShowPage.searchModal.tagsSection.tagsMultiselectIsDisabled).to.be.false;
          });

          it('search by query should be disabled', () => {
            expect(PackageShowPage.searchModal.searchFieldIsDisabled).to.be.true;
          });

          describe('after click on "urgent" option', () => {
            beforeEach(async () => {
              await PackageShowPage.searchModal.tagsSection.tagsSelect.options(1).clickOption();
            });

            it('should close search modal', () => {
              expect(PackageShowPage.searchModal.isPresent).to.be.false;
            });

            it('should display resources tagged as urgent', () => {
              expect(PackageShowPage.titleList()).to.have.lengthOf(3);
            });
          });

          describe('when some of the tags was selected and do tags clear', () => {
            beforeEach(async () => {
              await PackageShowPage.searchModal.tagsSection.tagsSelect.options(0).clickOption();
              await PackageShowPage.clickListSearch();
              await PackageShowPage.searchModal.tagsSection.clearTagFilter();
            });

            it('should close search modal', () => {
              expect(PackageShowPage.searchModal.isPresent).to.be.false;
            });

            it('should display empty list of resources', () => {
              expect(PackageShowPage.titleList()).to.have.lengthOf(3);
            });
          });

          describe('when "urgent" and "not urgent" tags are selected', () => {
            beforeEach(async () => {
              await PackageShowPage.searchModal.tagsSection.tagsSelect.options(1).clickOption();
              await PackageShowPage.clickListSearch();
              await PackageShowPage.searchModal.tagsSection.tagsSelect.options(0).clickOption();
            });

            it('should close search modal', () => {
              expect(PackageShowPage.searchModal.isPresent).to.be.false;
            });

            it('displays resources tagged as "not urgent" and "urgent"', () => {
              expect(PackageShowPage.titleList()).to.have.lengthOf(3);
            });
          });
        });
      });

      describe('after doing a couple of clicks on accordion header', () => {
        beforeEach(async () => {
          await PackageShowPage.searchModal.tagsSection.clickTagHeader();
          await PackageShowPage.searchModal.tagsSection.clickTagHeader();
        });

        it('should collapse the accordion', () => {
          expect(PackageShowPage.searchModal.tagsSection.tagsAccordion.isOpen).to.be.false;
        });
      });
    });
  });

  describe('title sort functionality', () => {
    beforeEach(async function () {
      await this.visit(
        {
          pathname: `/eholdings/packages/${providerPackage.id}`,
          state: { eholdings: true }
        }
      );
      await PackageShowPage.whenLoaded();
    });
    describe('when no sort options are chosen by user', () => {
      beforeEach(() => {
        return PackageShowPage.clickListSearch();
      });
      describe('search form', () => {
        it('should show "relevance" sort option as the default', () => {
          expect(PackageShowPage.searchModal.sortBy).to.equal('relevance');
        });
      });
    });

    describe('when "name" sort option is chosen by user', () => {
      beforeEach(async () => {
        await PackageShowPage.clickListSearch();
        await PackageShowPage.searchModal.toggleAccordion('#accordion-toggle-button-filter-titles-sort');
        await PackageShowPage.searchModal.clickFilter('sort', 'name');
      });
      describe('search form', () => {
        it('should show "name" sort option', () => {
          expect(PackageShowPage.searchModal.sortBy).to.equal('name');
        });
      });

      describe('then performing a search and opening the search modal again', () => {
        beforeEach(async () => {
          await PackageShowPage.searchModal.searchTitles('title');
          await PackageShowPage.searchModal.clickSearch();
          await PackageShowPage.clickListSearch();
        });
        describe('search form', () => {
          it('should keep previous sort option', () => {
            expect(PackageShowPage.searchModal.sortBy).to.equal('name');
          });
        });
      });

      describe('then reset to default sort option', () => {
        beforeEach(async () => {
          await PackageShowPage.searchModal.resetSortFilter();
        });

        describe('search form', () => {
          it('should show "relevance" sort option as the default', () => {
            expect(PackageShowPage.searchModal.sortBy).to.equal('relevance');
          });
        });
      });
    });
  });

  describe('navigating to package show page with over 10k related resources', () => {
    beforeEach(async function () {
      const largeProviderPackage = await this.server.create(
        'package',
        {
          provider,
          name: 'Cool Large Package',
          contentType: 'E-Book',
          isSelected: false,
          titleCount: 1500000,
          packageType: 'Complete'
        }
      );

      await this.server.get(`packages/${largeProviderPackage.id}/resources`,
        {
          'data': [],
          'meta': { 'totalResults': 10000 },
          'jsonapi': { 'version': '1.0' }
        }, 200);

      await this.visit(
        {
          pathname: `/eholdings/packages/${largeProviderPackage.id}`,
          // our internal link component automatically sets the location state
          state: { eholdings: true }
        }
      );
      await PackageShowPage.whenLoaded();
    });

    it('displays the number of title records in package details', () => {
      expect(PackageShowPage.numTitles).to.equal('1,500,000');
    });

    it('displays Over 10,000 as number of title records in list header', () => {
      expect(PackageShowPage.searchResultsCount).to.contain('Over');
      expect(PackageShowPage.searchResultsCount).to.contain('10,000');
    });
  });
});

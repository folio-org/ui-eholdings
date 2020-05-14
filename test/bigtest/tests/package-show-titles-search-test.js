import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';

describe('Package Show Title Search', () => {
  setupApplication();
  let provider,
    resources,
    providerPackage,
    trialAccessType,
    subscriptionAccessType;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create(
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

    resources = this.server.schema.where('resource', {
      packageId: providerPackage.id
    }).models;

    trialAccessType = this.server.create('access-type', {
      name: 'Trial',
    });
    subscriptionAccessType = this.server.create('access-type', {
      name: 'Subscription',
    });

    resources[0].title.update({
      name: 'My Title 1',
      publicationType: 'report',
      subjects: [this.server.create('subject', { subject: 'FooBar' }).toJSON()],
    });

    resources[0].update({
      isSelected: true,
      accessType: trialAccessType,
    });

    resources[0].title.update({
      tags: {
        tagList: ['urgent', 'not urgent']
      }
    });

    resources[1].title.update({
      name: 'My Title 2',
      publicationType: 'book',
      publisherName: 'The Frontside',
      tags: {
        tagList: ['urgent']
      },
    });

    resources[1].update({
      isSelected: false,
      accessType: subscriptionAccessType,
    });

    resources[2].title.update({
      name: 'SUPER Duper 3',
      publicationType: 'book',
      tags: {
        tagList: ['urgent']
      },
    });

    resources[2].update({
      isSelected: false
    });
  });

  describe('navigating to package show page to filter titles', () => {
    beforeEach(function () {
      this.visit(
        {
          pathname: `/eholdings/packages/${providerPackage.id}`,
          // our internal link component automatically sets the location state
          state: { eholdings: true }
        }
      );
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

      describe('after clicking on access types accordion header', () => {
        beforeEach(async () => {
          await PackageShowPage.searchModal.accessTypesSection.clickAccessTypesHeader();
        });

        it('should expand the accordion', () => {
          expect(PackageShowPage.searchModal.accessTypesSection.accessTypesAccordion.isOpen).to.be.true;
        });

        it('search by access types should be disabled', () => {
          expect(PackageShowPage.searchModal.accessTypesSection.accessTypesCheckboxIsChecked).to.be.false;
          expect(PackageShowPage.searchModal.accessTypesSection.accessTypesMultiselectIsDisabled).to.be.true;
        });

        it('search by query should be enabled', () => {
          expect(PackageShowPage.searchModal.searchFieldIsDisabled).to.be.false;
        });

        it('displays access types filter with empty value by default', () => {
          expect(PackageShowPage.searchModal.accessTypesSection.accessTypesSelect.values()).to.deep.equal([]);
        });

        describe('after enabling search by access types', () => {
          beforeEach(async () => {
            await PackageShowPage.searchModal.accessTypesSection.toggleSearchByAccessTypes();
          });

          it('search by access types should be enabled', () => {
            expect(PackageShowPage.searchModal.accessTypesSection.accessTypesCheckboxIsChecked).to.be.true;
            expect(PackageShowPage.searchModal.accessTypesSection.accessTypesMultiselectIsDisabled).to.be.false;
          });

          it('search by query should be disabled', () => {
            expect(PackageShowPage.searchModal.searchFieldIsDisabled).to.be.true;
          });

          describe('after clicking on "Trial" option', () => {
            beforeEach(async () => {
              await PackageShowPage.searchModal.accessTypesSection.accessTypesSelect.options(0).clickOption();
            });

            it('should close search modal', () => {
              expect(PackageShowPage.searchModal.isPresent).to.be.false;
            });

            it('should display resources with access type Trial', () => {
              expect(PackageShowPage.titleList()).to.have.lengthOf(1);
            });
          });

          describe('when "Trial" and "Subscription" access types are selected', () => {
            beforeEach(async () => {
              await PackageShowPage.searchModal.accessTypesSection.accessTypesSelect.options(0).clickOption();
              await PackageShowPage.clickListSearch();
              await PackageShowPage.searchModal.accessTypesSection.accessTypesSelect.options(1).clickOption();
            });

            it('should close search modal', () => {
              expect(PackageShowPage.searchModal.isPresent).to.be.false;
            });

            it('displays resources with "Trial" and "Subscription" access types', () => {
              expect(PackageShowPage.titleList()).to.have.lengthOf(2);
            });
          });

          describe('when some of the access types were selected and do access types clear', () => {
            beforeEach(async () => {
              await PackageShowPage.searchModal.accessTypesSection.accessTypesSelect.options(0).clickOption();
              await PackageShowPage.clickListSearch();
              await PackageShowPage.searchModal.accessTypesSection.clearAccessTypesFilter();
            });

            it('should close search modal', () => {
              expect(PackageShowPage.searchModal.isPresent).to.be.false;
            });

            it('should display empty list of resources', () => {
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

    describe('when access types were not created in settings', () => {
      beforeEach(async function () {
        this.server.get('/access-types', () => []);

        this.visit(
          {
            pathname: `/eholdings/packages/${providerPackage.id}`,
            state: { eholdings: true }
          }
        );

        await PackageShowPage.clickListSearch();
      });

      it('should not render filter by access types section', () => {
        expect(PackageShowPage.accessTypesSection.hasAccessTypesAccordion).to.be.false;
      });
    });
  });

  describe('title sort functionality', () => {
    beforeEach(function () {
      this.visit(
        {
          pathname: `/eholdings/packages/${providerPackage.id}`,
          state: { eholdings: true }
        }
      );
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
        beforeEach(() => {
          return PackageShowPage.searchModal.searchTitles('title')
            .searchModal.clickSearch()
            .clickListSearch();
        });
        describe('search form', () => {
          it('should keep previous sort option', () => {
            expect(PackageShowPage.searchModal.sortBy).to.equal('name');
          });
        });
      });

      describe('then reset to default sort option', () => {
        beforeEach(() => {
          return PackageShowPage.searchModal.resetSortFilter();
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
    beforeEach(function () {
      const largeProviderPackage = this.server.create(
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

      this.server.get(`packages/${largeProviderPackage.id}/resources`,
        {
          'data': [],
          'meta': { 'totalResults': 10000 },
          'jsonapi': { 'version': '1.0' }
        }, 200);

      this.visit(
        {
          pathname: `/eholdings/packages/${largeProviderPackage.id}`,
          // our internal link component automatically sets the location state
          state: { eholdings: true }
        }
      );
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

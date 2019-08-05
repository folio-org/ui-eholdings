import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ProviderShowPage from '../interactors/provider-show';

describe('ProviderShow package search', () => {
  setupApplication();
  let provider,
    packages;

  beforeEach(function () {
    provider = this.server.create('provider', 'withPackagesAndTitles', {
      name: 'League of Ordinary Men',
      packagesTotal: 5
    });

    packages = this.server.schema.where('package', {
      providerId: provider.id
    }).models;

    packages.forEach((p, i) => p.update({
      name: `Package ${i}`,
      contentType: 'Print'
    }));

    packages[0].update({
      tags: {
        tagList: ['urgent']
      }
    });

    packages[1].update({
      tags: {
        tagList: ['urgent']
      }
    });

    packages[2].update({
      name: 'Ordinary Package',
      contentType: 'eBook',
      isSelected: false,
      tags: {
        tagList: ['not urgent', 'urgent']
      }
    });

    packages[4].update({
      name: 'Other Ordinary Package',
      isSelected: true,
    });

    this.visit(`/eholdings/providers/${provider.id}`);
  });

  describe('clicking the search button', () => {
    beforeEach(() => {
      return ProviderShowPage.clickListSearch();
    });

    it('shows the package search modal', () => {
      expect(ProviderShowPage.searchModal.isPresent).to.be.true;
    });

    it('shows empty text field', () => {
      expect(ProviderShowPage.searchModal.searchFieldValue).to.equal('');
    });

    it('text field should be enabled', () => {
      expect(ProviderShowPage.searchModal.searchFieldIsDisabled).to.be.false;
    });

    it('all filter accordions should be collapsed', () => {
      ProviderShowPage.searchModal.filterAccordions().forEach(accordion => {
        expect(accordion.isOpen).to.be.false;
      });
    });

    it('has default filters selected', () => {
      expect(ProviderShowPage.searchModal.getFilter('sort')).to.equal('relevance');
      expect(ProviderShowPage.searchModal.getFilter('selected')).to.equal('all');
      expect(ProviderShowPage.searchModal.getFilter('type')).to.equal('all');
    });

    it('does not display badge', () => {
      expect(ProviderShowPage.filterBadge).to.be.false;
    });


    it('disables search button', () => {
      expect(ProviderShowPage.searchModal.isSearchButtonDisabled).to.be.true;
    });

    it('disables the reset all button', () => {
      expect(ProviderShowPage.searchModal.isResetButtonDisabled).to.be.true;
    });

    describe('with filter change', () => {
      beforeEach(async () => {
        await ProviderShowPage.searchModal.toggleAccordion('#accordion-toggle-button-filter-packages-sort');
        await ProviderShowPage.searchModal.clickFilter('sort', 'name');
      });

      it('enables the search button', () => {
        expect(ProviderShowPage.searchModal.isSearchButtonDisabled).to.be.false;
      });

      it('enables the reset all button', () => {
        expect(ProviderShowPage.searchModal.isResetButtonDisabled).to.be.false;
      });

      describe('applying filters', () => {
        beforeEach(() => {
          return ProviderShowPage.searchModal.clickSearch();
        });
        it('applies the changes and closes the modal', () => {
          expect(ProviderShowPage.searchModal.isPresent).to.be.false;
        });
      });
    });

    describe('filtering packages by tags', () => {
      it('shows the accordion with tags filter', () => {
        expect(ProviderShowPage.searchModal.tagsSection.tagsAccordion.isPresent).to.be.true;
      });

      it('accordion is closed by default', () => {
        expect(ProviderShowPage.searchModal.tagsSection.tagsAccordion.isOpen).to.be.false;
      });

      describe('after click on accordion header', () => {
        beforeEach(async () => {
          await ProviderShowPage.searchModal.tagsSection.clickTagHeader();
        });

        it('should expand the accordion', () => {
          expect(ProviderShowPage.searchModal.tagsSection.tagsAccordion.isOpen).to.be.true;
        });

        it('search by tags should be disabled', () => {
          expect(ProviderShowPage.searchModal.tagsSection.tagsCheckboxIsChecked).to.be.false;
          expect(ProviderShowPage.searchModal.tagsSection.tagsMultiselectIsDisabled).to.be.true;
        });
      });

      describe('after doing a couple of clicks on accordion header', () => {
        beforeEach(async () => {
          await ProviderShowPage.searchModal.tagsSection.clickTagHeader();
          await ProviderShowPage.searchModal.tagsSection.clickTagHeader();
        });

        it('should collapse the accordion', () => {
          expect(ProviderShowPage.searchModal.tagsSection.tagsAccordion.isOpen).to.be.false;
        });
      });

      it('displays tag filter with empty value by default', () => {
        expect(ProviderShowPage.searchModal.tagsSection.tagsSelect.values()).to.deep.equal([]);
      });

      describe('after enabling search by tags', () => {
        beforeEach(async () => {
          await ProviderShowPage.searchModal.tagsSection.toggleSearchByTags();
        });

        it('search by tags should be enabled', () => {
          expect(ProviderShowPage.searchModal.tagsSection.tagsCheckboxIsChecked).to.be.true;
          expect(ProviderShowPage.searchModal.tagsSection.tagsMultiselectIsDisabled).to.be.false;
        });

        it('search by query should be disabled', () => {
          expect(ProviderShowPage.searchModal.searchFieldIsDisabled).to.be.true;
        });

        describe('after click on "urgent" option', () => {
          beforeEach(async () => {
            await ProviderShowPage.searchModal.tagsSection.tagsSelect.options(1).clickOption();
          });

          it('should close search modal', () => {
            expect(ProviderShowPage.searchModal.isPresent).to.be.false;
          });

          it('should display packages tagged as urgent', () => {
            expect(ProviderShowPage.packageList()).to.have.lengthOf(3);
          });
        });

        describe('when some of the tags was selected and do tags clear', () => {
          beforeEach(async () => {
            await ProviderShowPage.searchModal.tagsSection.tagsSelect.options(0).clickOption();
            await ProviderShowPage.clickListSearch();
            await ProviderShowPage.searchModal.tagsSection.clearTagFilter();
          });

          it('should close search modal', () => {
            expect(ProviderShowPage.searchModal.isPresent).to.be.false;
          });

          it('should display empty list of packages', () => {
            expect(ProviderShowPage.packageList()).to.have.lengthOf(5);
          });
        });

        describe('when "urgent" and "not urgent" tags are selected', () => {
          beforeEach(async () => {
            await ProviderShowPage.searchModal.tagsSection.tagsSelect.options(1).clickOption();
            await ProviderShowPage.clickListSearch();
            await ProviderShowPage.searchModal.tagsSection.tagsSelect.options(0).clickOption();
          });

          it('should close search modal', () => {
            expect(ProviderShowPage.searchModal.isPresent).to.be.false;
          });

          it('displays packages tagged as "not urgent" and "urgent"', () => {
            expect(ProviderShowPage.packageList()).to.have.lengthOf(3);
          });
        });
      });
    });
  });

  describe('filter package by search term', () => {
    beforeEach(() => {
      return ProviderShowPage.clickListSearch()
        .searchModal.search('ordinary');
    });

    it('displays filtered list', () => {
      expect(ProviderShowPage.packageList()).to.have.lengthOf(2);
      expect(ProviderShowPage.packageList(0).name).to.equal('Ordinary Package');
      expect(ProviderShowPage.packageList(1).name).to.equal('Other Ordinary Package');
    });

    describe('clearing the search and saving', () => {
      beforeEach(() => {
        return ProviderShowPage.clickListSearch()
          .searchModal.clearSearch();
      });

      it('shows empty search', () => {
        expect(ProviderShowPage.searchModal.searchFieldValue).to.equal('');
      });

      it('enables the search button', () => {
        expect(ProviderShowPage.searchModal.isSearchButtonDisabled).to.be.false;
      });

      it('disables the reset all button', () => {
        expect(ProviderShowPage.searchModal.isResetButtonDisabled).to.be.true;
      });

      describe('applying the cleared search changes', () => {
        beforeEach(() => {
          return ProviderShowPage.searchModal.clickSearch();
        });

        it('applies the change and closes the modal', () => {
          expect(ProviderShowPage.searchModal.isPresent).to.be.false;
        });

        it('displays unfiltered list by search term', () => {
          expect(ProviderShowPage.packageList()).to.have.lengthOf(5);
        });
      });
    });
  });

  describe('searching for specific packages', () => {
    beforeEach(() => {
      return ProviderShowPage.clickListSearch()
        .searchModal.search('other ordinary');
    });

    it('displays packages matching the search term', () => {
      expect(ProviderShowPage.packageList()).to.have.lengthOf(2);
      expect(ProviderShowPage.packageList(0).name).to.equal('Other Ordinary Package');
      expect(ProviderShowPage.packageList(1).name).to.equal('Ordinary Package');
    });

    it('displays the number of relevant package records', () => {
      expect(ProviderShowPage.searchResultsCount).to.equal('2');
    });

    it('displays updated filter count', () => {
      expect(ProviderShowPage.searchModalBadge.filterText).to.equal('1');
    });

    describe('then sorting by package name', () => {
      beforeEach(async () => {
        await ProviderShowPage.clickListSearch();
        await ProviderShowPage.searchModal.toggleAccordion('#accordion-toggle-button-filter-packages-sort');
        await ProviderShowPage.searchModal.clickFilter('sort', 'name');
        await ProviderShowPage.searchModal.clickSearch();
      });

      it('displays packages matching the search term ordered by name', () => {
        expect(ProviderShowPage.packageList()).to.have.lengthOf(2);
        expect(ProviderShowPage.packageList(0).name).to.equal('Ordinary Package');
        expect(ProviderShowPage.packageList(1).name).to.equal('Other Ordinary Package');
      });

      describe('resetting all filters', () => {
        // open modal
        // click reset all button
        beforeEach(() => {
          return ProviderShowPage.clickListSearch()
            .searchModal.clickResetAll();
        });

        it('closes the modal', () => {
          expect(ProviderShowPage.searchModal.isPresent).to.be.false;
        });

        it('shows unfiltered list', () => {
          expect(ProviderShowPage.packageList()).to.have.lengthOf(5);
        });
      });
    });

    describe('then filtering the packages by selection status', () => {
      beforeEach(async () => {
        await ProviderShowPage.clickListSearch();
        await ProviderShowPage.searchModal.toggleAccordion('#accordion-toggle-button-filter-packages-selected');
        await ProviderShowPage.searchModal.clickFilter('selected', 'true');
        await ProviderShowPage.searchModal.clickSearch();
      });

      it('displays selected packages matching the search term', () => {
        expect(ProviderShowPage.packageList()).to.have.lengthOf(1);
        expect(ProviderShowPage.packageList(0).name).to.equal('Other Ordinary Package');
      });

      it('displays updated filter count', () => {
        expect(ProviderShowPage.searchModalBadge.filterText).to.equal('2');
      });
    });

    describe('then filtering the packages by content type', () => {
      beforeEach(async () => {
        await ProviderShowPage.clickListSearch();
        await ProviderShowPage.searchModal.toggleAccordion('#accordion-toggle-button-filter-packages-type');
        await ProviderShowPage.searchModal.clickFilter('type', 'ebook');
        await ProviderShowPage.searchModal.clickSearch();
      });

      it('displays packages matching the search term and content type', () => {
        expect(ProviderShowPage.packageList()).to.have.lengthOf(1);
        expect(ProviderShowPage.packageList(0).name).to.equal('Ordinary Package');
      });
      it('displays updated filter count', () => {
        expect(ProviderShowPage.searchModalBadge.filterText).to.equal('2');
      });
    });
  });

  describe('navigating to provider show page with over 10k related packages', () => {
    beforeEach(function () {
      const largeProvider = this.server.create('provider',
        {
          name: 'Large Provider Test',
          packagesTotal: 1500000
        });

      this.server.get(`providers/${largeProvider.id}/packages`,
        {
          'data': [],
          'meta': { 'totalResults': 10001 },
          'jsonapi': { 'version': '1.0' }
        }, 200);

      this.visit(
        {
          pathname: `/eholdings/providers/${largeProvider.id}`,
          // our internal link component automatically sets the location state
          state: { eholdings: true }
        }
      );
    });

    it('displays the number of package records in provider details', () => {
      expect(ProviderShowPage.numPackages).to.equal('1,500,000');
    });

    it('displays Over 10,000 as number of title records in list header', () => {
      expect(ProviderShowPage.searchResultsCount).to.contain('Over');
      expect(ProviderShowPage.searchResultsCount).to.contain('10,000');
    });
  });
});

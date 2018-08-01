import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from '../helpers/describe-application';
import ProviderShowPage from '../interactors/provider-show';

describeApplication('ProviderShow package search', () => {
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

    packages[2].update({
      name: 'Ordinary Package',
      contentType: 'eBook',
      isSelected: false
    });

    packages[4].update({
      name: 'Other Ordinary Package',
      isSelected: true
    });

    return this.visit(`/eholdings/providers/${provider.id}`, () => {
      expect(ProviderShowPage.$root).to.exist;
    });
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
      beforeEach(() => {
        return ProviderShowPage.searchModal.clickFilter('sort', 'name');
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
      expect(ProviderShowPage.numFilters).to.equal('1');
    });

    describe('then sorting by package name', () => {
      beforeEach(() => {
        return ProviderShowPage.clickListSearch()
          .searchModal.clickFilter('sort', 'name')
          .searchModal.clickSearch();
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
      beforeEach(() => {
        return ProviderShowPage.clickListSearch()
          .searchModal.clickFilter('selected', 'true')
          .searchModal.clickSearch();
      });

      it('displays selected packages matching the search term', () => {
        expect(ProviderShowPage.packageList()).to.have.lengthOf(1);
        expect(ProviderShowPage.packageList(0).name).to.equal('Other Ordinary Package');
      });

      it('displays updated filter count', () => {
        expect(ProviderShowPage.numFilters).to.equal('2');
      });
    });

    describe('then filtering the packages by content type', () => {
      beforeEach(() => {
        return ProviderShowPage.clickListSearch()
          .searchModal.clickFilter('type', 'ebook')
          .searchModal.clickSearch();
      });

      it('displays packages matching the search term and content type', () => {
        expect(ProviderShowPage.packageList()).to.have.lengthOf(1);
        expect(ProviderShowPage.packageList(0).name).to.equal('Ordinary Package');
      });
      it('displays updated filter count', () => {
        expect(ProviderShowPage.numFilters).to.equal('2');
      });
    });
  });
});

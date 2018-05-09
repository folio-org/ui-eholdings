import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ProviderShowPage from './pages/provider-show';

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

    it('displays 0 filter count', () => {
      expect(ProviderShowPage.numFilters).to.equal('0');
    });
  });

  describe('searching for specific packages', () => {
    beforeEach(() => {
      return ProviderShowPage.clickListSearch()
        .searchModal.search('other ordinary');
    });

    it('hides the package search modal', () => {
      expect(ProviderShowPage.searchModal.isPresent).to.be.false;
    });

    it('displays packages matching the search term', () => {
      expect(ProviderShowPage.packageList()).to.have.lengthOf(2);
      expect(ProviderShowPage.packageList(0).name).to.equal('Other Ordinary Package');
      expect(ProviderShowPage.packageList(1).name).to.equal('Ordinary Package');
    });

    it('displays updated filter count', () => {
      expect(ProviderShowPage.numFilters).to.equal('1');
    });


    describe('reopening the modal', () => {
      beforeEach(() => {
        return ProviderShowPage.clickListSearch();
      });

      it('shows the previous search term', () => {
        expect(ProviderShowPage.searchModal.searchFieldValue).to.equal('other ordinary');
      });
    });

    describe('then sorting by package name', () => {
      beforeEach(() => {
        return ProviderShowPage.clickListSearch()
          .searchModal.clickFilter('sort', 'name');
      });

      it.always('leaves the search modal open', () => {
        expect(ProviderShowPage.searchModal.isPresent).to.be.true;
      });

      it('displays packages matching the search term ordered by name', () => {
        expect(ProviderShowPage.packageList()).to.have.lengthOf(2);
        expect(ProviderShowPage.packageList(0).name).to.equal('Ordinary Package');
        expect(ProviderShowPage.packageList(1).name).to.equal('Other Ordinary Package');
      });
    });

    describe('then filtering the packages by selection status', () => {
      beforeEach(() => {
        return ProviderShowPage.clickListSearch()
          .searchModal.clickFilter('selected', 'true');
      });

      it.always('leaves the search modal open', () => {
        expect(ProviderShowPage.searchModal.isPresent).to.be.true;
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
          .searchModal.clickFilter('type', 'ebook');
      });

      it.always('leaves the search modal open', () => {
        expect(ProviderShowPage.searchModal.isPresent).to.be.true;
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

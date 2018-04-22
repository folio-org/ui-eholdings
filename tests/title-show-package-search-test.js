import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import TitleShowPage from './pages/title-show';

describeApplication('TitleShow package search', () => {
  beforeEach(function () {
    let title = this.server.create('title', {
      name: 'Cool Title',
      publisherName: 'Cool Publisher'
    });

    let packages = this.server.createList('package', 5, 'withProvider', {
      name: i => `Package ${i}`,
      contentType: 'Print'
    });

    packages[2].update({
      name: 'Ordinary Package',
      contentType: 'eBook',
      isSelected: false
    });

    packages[4].update({
      name: 'Other Ordinary Package',
      isSelected: true
    });

    packages.forEach((pkg) => {
      this.server.create('resource', {
        package: pkg,
        title,
        isSelected: pkg.isSelected
      });
    });

    return this.visit(`/eholdings/titles/${title.id}`, () => {
      expect(TitleShowPage.$root).to.exist;
    });
  });

  describe('clicking the search button', () => {
    beforeEach(() => {
      return TitleShowPage.clickListSearch();
    });

    it('shows the package search modal', () => {
      expect(TitleShowPage.searchModal.exists).to.be.true;
    });
  });

  describe('searching for specific packages', () => {
    beforeEach(() => {
      return TitleShowPage.clickListSearch()
        .append(TitleShowPage.searchModal.search('other ordinary'));
    });

    it('hides the package search modal', () => {
      expect(TitleShowPage.searchModal.exists).to.be.false;
    });

    it('displays packages matching the search term', () => {
      expect(TitleShowPage.packageList()).to.have.lengthOf(2);
      expect(TitleShowPage.packageList(0).name).to.equal('Other Ordinary Package');
      expect(TitleShowPage.packageList(1).name).to.equal('Ordinary Package');
    });

    describe('reopening the modal', () => {
      beforeEach(() => {
        return TitleShowPage.clickListSearch();
      });

      it('shows the previous search term', () => {
        expect(TitleShowPage.searchModal.searchFieldValue).to.equal('other ordinary');
      });
    });

    describe('then sorting by package name', () => {
      beforeEach(() => {
        return TitleShowPage.clickListSearch()
          .append(TitleShowPage.searchModal.clickFilter('sort', 'name'));
      });

      it.always('leaves the search modal open', () => {
        expect(TitleShowPage.searchModal.exists).to.be.true;
      });

      it('displays packages matching the search term ordered by name', () => {
        expect(TitleShowPage.packageList()).to.have.lengthOf(2);
        expect(TitleShowPage.packageList(0).name).to.equal('Ordinary Package');
        expect(TitleShowPage.packageList(1).name).to.equal('Other Ordinary Package');
      });
    });

    describe('then filtering the packages by selection status', () => {
      beforeEach(() => {
        return TitleShowPage.clickListSearch()
          .append(TitleShowPage.searchModal.clickFilter('selected', 'true'));
      });

      it.always('leaves the search modal open', () => {
        expect(TitleShowPage.searchModal.exists).to.be.true;
      });

      it('displays selected packages matching the search term', () => {
        expect(TitleShowPage.packageList()).to.have.lengthOf(1);
        expect(TitleShowPage.packageList(0).name).to.equal('Other Ordinary Package');
      });
    });

    describe('then filtering the packages by content type', () => {
      beforeEach(() => {
        return TitleShowPage.clickListSearch()
          .append(TitleShowPage.searchModal.clickFilter('type', 'ebook'));
      });

      it.always('leaves the search modal open', () => {
        expect(TitleShowPage.searchModal.exists).to.be.true;
      });

      it('displays packages matching the search term and content type', () => {
        expect(TitleShowPage.packageList()).to.have.lengthOf(1);
        expect(TitleShowPage.packageList(0).name).to.equal('Ordinary Package');
      });
    });
  });
});

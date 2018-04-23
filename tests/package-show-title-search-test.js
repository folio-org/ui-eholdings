import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageShow title search', () => {
  beforeEach(function () {
    let resources = [];

    let pkg = this.server.create('package', 'withProvider', {
      titleCount: 5
    });

    let titles = this.server.createList('title', 5, {
      name: i => `Title ${i}`,
      publicationType: 'book'
    });

    titles[2].update({
      name: 'Ordinary Title',
      publicationType: 'report',
      publisherName: 'Extraordinary Publisher'
    });

    titles[4].update({
      name: 'Other Ordinary Title'
    });

    titles.forEach((title) => {
      resources.push(this.server.create('resource', {
        package: pkg,
        title,
        isSelected: false
      }));
    });

    resources[4].update({
      isSelected: true
    });

    return this.visit(`/eholdings/packages/${pkg.id}`, () => {
      expect(PackageShowPage.$root).to.exist;
    });
  });

  describe('clicking the search button', () => {
    beforeEach(() => {
      return PackageShowPage.clickListSearch();
    });

    it('shows the title search modal', () => {
      expect(PackageShowPage.searchModal.exists).to.be.true;
    });
  });

  describe('searching for specific titles', () => {
    beforeEach(() => {
      return PackageShowPage.clickListSearch()
        .append(PackageShowPage.searchModal.search('other ordinary'));
    });

    it('hides the title search modal', () => {
      expect(PackageShowPage.searchModal.exists).to.be.false;
    });

    it('displays titles matching the search term', () => {
      expect(PackageShowPage.titleList()).to.have.lengthOf(2);
      expect(PackageShowPage.titleList(0).name).to.equal('Other Ordinary Title');
      expect(PackageShowPage.titleList(1).name).to.equal('Ordinary Title');
    });

    describe('reopening the modal', () => {
      beforeEach(() => {
        return PackageShowPage.clickListSearch();
      });

      it('shows the previous search term', () => {
        expect(PackageShowPage.searchModal.searchFieldValue).to.equal('other ordinary');
      });
    });

    describe('then filtering the titles by a different type of search query', () => {
      beforeEach(() => {
        return PackageShowPage.clickListSearch()
          .append(
            PackageShowPage
              .searchModal.selectSearchField('publisher')
              .search('Extraordinary Publisher')
          );
      });

      it('hides the title search modal', () => {
        expect(PackageShowPage.searchModal.exists).to.be.false;
      });

      it('displays selected titles matching the search term', () => {
        expect(PackageShowPage.titleList()).to.have.lengthOf(1);
        expect(PackageShowPage.titleList(0).name).to.equal('Ordinary Title');
      });
    });

    describe('then filtering the titles by selection status', () => {
      beforeEach(() => {
        return PackageShowPage.clickListSearch()
          .append(PackageShowPage.searchModal.clickFilter('selected', 'true'));
      });

      it.always('leaves the search modal open', () => {
        expect(PackageShowPage.searchModal.exists).to.be.true;
      });

      it('displays selected titles matching the search term', () => {
        expect(PackageShowPage.titleList()).to.have.lengthOf(1);
        expect(PackageShowPage.titleList(0).name).to.equal('Other Ordinary Title');
      });
    });

    describe('then filtering the titles by publication type', () => {
      beforeEach(() => {
        return PackageShowPage.clickListSearch()
          .append(PackageShowPage.searchModal.clickFilter('type', 'report'));
      });

      it.always('leaves the search modal open', () => {
        expect(PackageShowPage.searchModal.exists).to.be.true;
      });

      it('displays titles matching the search term and publication type', () => {
        expect(PackageShowPage.titleList()).to.have.lengthOf(1);
        expect(PackageShowPage.titleList(0).name).to.equal('Ordinary Title');
      });
    });
  });
});

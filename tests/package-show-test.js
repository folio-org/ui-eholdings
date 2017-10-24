/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageShow', () => {
  let vendor,
    vendorPackage,
    customerResources;

  beforeEach(function () {
    vendor = this.server.create('vendor', {
      vendorName: 'Cool Vendor'
    });

    vendorPackage = this.server.create('package', 'withTitles', {
      vendor,
      packageName: 'Cool Package',
      contentType: 'ebook',
      titleCount: 5
    });

    customerResources = this.server.schema.where('customer-resource', { packageId: vendorPackage.id }).models;
  });

  describe('visiting the package details page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the package name', () => {
      expect(PackageShowPage.name).to.equal('Cool Package');
    });

    it('displays whether or not the package is selected', () => {
      expect(PackageShowPage.isSelected).to.equal(`${vendorPackage.isSelected ? 'Yes' : 'No'}`);
    });

    it('displays the content type', () => {
      expect(PackageShowPage.contentType).to.equal('E-Book');
    });

    it('displays the total number of titles', () => {
      expect(PackageShowPage.numTitles).to.equal(`${vendorPackage.titleCount}`);
    });

    it('displays the number of selected titles', () => {
      expect(PackageShowPage.numTitlesSelected).to.equal(`${vendorPackage.selectedCount}`);
    });

    it('displays a list of titles', () => {
      expect(PackageShowPage.titleList).to.have.lengthOf(customerResources.length);
    });

    it('displays name of a title in the title list', () => {
      expect(PackageShowPage.titleList[0].name).to.equal(customerResources[0].title.titleName);
    });

    it('displays whether the first title is selected', () => {
      expect(PackageShowPage.titleList[0].isSelected).to.equal(customerResources[0].isSelected);
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/vendors/:vendorId/packages/:packageId', [{
        message: 'There was an error',
        code: '1000',
        subcode: 0
      }], 500);

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('dies with dignity', () => {
      expect(PackageShowPage.hasErrors).to.be.true;
    });
  });
});

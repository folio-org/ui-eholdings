/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import CustomerResourceShowPage from './pages/customer-resource-show';

describeApplication('CustomerResourceShow', function() {
  let vendor, vendorPackage, customerResources;

    beforeEach(function() {
      vendor = this.server.create('vendor', {
        vendorName: 'Cool Vendor'
      });

      vendorPackage = this.server.create('package', 'withTitles', {
        vendor,
        packageName: 'Cool Package',
        contentType: 'e-book',
        titleCount: 5
      });

      customerResources = this.server.schema.where('customer-resource', { packageId: vendorPackage.id }).models;
    });

  describe("visiting the customer resource page", function() {

    beforeEach(function() {
      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}/titles/${customerResources[0].titleId}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the vendor name', function() {
      expect(CustomerResourceShowPage.vendorName).to.equal('Cool Vendor');
    });

    it('displays the package name', function() {
      expect(CustomerResourceShowPage.packageName).to.equal('Cool Package');
    });

    it('displays the title name', function() {
      expect(CustomerResourceShowPage.titleName).to.equal(customerResources[0].title.titleName);
    });

    it('displays if the customer resource is selected', function() {
      expect(CustomerResourceShowPage.isSelected).to.equal(`Selected${customerResources[0].isSelected ? 'Selected' : 'Not Selected'}`);
    });
  });

  describe("encountering a server error", function() {
    beforeEach(function() {
      this.server.get('/vendors/:vendorId/packages/:packageId/titles/:titleId', [{
        message: 'There was an error',
        code: "1000",
        subcode: 0
      }], 500);

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}/titles/${customerResources[0].titleId}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it("dies with dignity", function() {
      expect(CustomerResourceShowPage.hasErrors).to.be.true;
    });
  });
});

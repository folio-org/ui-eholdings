/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import VendorDetailsPage from './pages/vendor-details';

describeApplication('VendorDetails', function() {
  let vendor;
  let vendorPackages;

  beforeEach(function() {
    vendor = this.server.create('vendor', {
      vendorName: 'League of Ordinary Men',
      totalPackages: 5
    });
  });

  describe("visiting the vendor details page", function() {

    beforeEach(function() {
      return this.visit(`/eholdings/vendors/${vendor.id}`, () => {
        expect(VendorDetailsPage.$root).to.exist;
      });
    });

    it('displays the vendor name', function() {
      expect(VendorDetailsPage.name).to.equal('League of Ordinary Men');
    });

    it('displays the total number of packages', function() {
      expect(VendorDetailsPage.numPackages).to.equal(`Total Packages${vendor.packagesTotal}`);
    });

    it('displays the number of selected packages', function() {
      expect(VendorDetailsPage.numPackagesSelected).to.equal(`Packages Selected${vendor.packagesSelected}`);
    });

    it.skip('displays a list of packages', function() {
      expect(VendorDetailsPage.packageList).to.have.lengthOf(1);
    });

    it.skip('displays name of a package in the package list', function() {
      expect(VendorDetailsPage.packageList[0].name).to.equal(vendorPackages[0].name);
    });

    it.skip('displays number of selected titles for a package', function() {
      expect(VendorDetailsPage.packageList[0].numTitles).to.equal(vendorPackages[0].selectedCount);
    });

    it.skip('displays total number of titles for a package', function() {
      expect(VendorDetailsPage.packageList[0].numTitlesSelected).to.equal(vendorPackages[0].titleCount);
    });
  });

  describe("encountering a server error", function() {
    beforeEach(function() {
      this.server.get('/vendors/:id', [{
        message: 'There was an error',
        code: "1000",
        subcode: 0
      }], 500);

      return this.visit(`/eholdings/vendors/${vendor.id}`, () => {
        expect(VendorDetailsPage.$root).to.exist;
      });
    });

    it("dies with dignity", function() {
      expect(VendorDetailsPage.hasErrors).to.be.true;
    });
  });
});

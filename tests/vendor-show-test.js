/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import VendorShowPage from './pages/vendor-show';

describeApplication('VendorShow', function() {
  let vendor, packages;

  beforeEach(function() {
    vendor = this.server.create('vendor', 'withPackagesAndTitles', {
      vendorName: 'League of Ordinary Men',
      packagesTotal: 5
    });

    packages = this.server.schema.where('package', { vendorId: vendor.id }).models;
  });

  describe("visiting the vendor details page", function() {
    beforeEach(function() {
      return this.visit(`/eholdings/vendors/${vendor.id}`, () => {
        expect(VendorShowPage.$root).to.exist;
      });
    });

    it('displays the vendor name', function() {
      expect(VendorShowPage.name).to.equal('League of Ordinary Men');
    });

    it('displays the total number of packages', function() {
      expect(VendorShowPage.numPackages).to.equal(`${vendor.packagesTotal}`);
    });

    it('displays the number of selected packages', function() {
      expect(VendorShowPage.numPackagesSelected).to.equal(`${vendor.packagesSelected}`);
    });

    it('displays a list of packages', function() {
      expect(VendorShowPage.packageList).to.have.lengthOf(packages.length);
    });

    it('displays name of a package in the package list', function() {
      expect(VendorShowPage.packageList[0].name).to.equal(packages[0].packageName);
    });

    it('displays number of selected titles for a package', function() {
      expect(VendorShowPage.packageList[0].numTitles).to.equal(packages[0].selectedCount);
    });

    it('displays total number of titles for a package', function() {
      expect(VendorShowPage.packageList[0].numTitlesSelected).to.equal(packages[0].titleCount);
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
        expect(VendorShowPage.$root).to.exist;
      });
    });

    it("dies with dignity", function() {
      expect(VendorShowPage.hasErrors).to.be.true;
    });
  });
});

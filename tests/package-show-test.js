/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageShow', function() {
  let vendor;
  let vendorPackage;

  beforeEach(function() {
    vendorPackage = this.server.create('package', {
      packageName: 'Cool Package',
      contentType: 'e-book'
    });
    vendor = vendorPackage.createVendor({
      vendorName: 'Cool Vendor'
    });
  });

  describe("visiting the package details page", function() {
    beforeEach(function() {
      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the package name', function() {
      expect(PackageShowPage.name).to.equal('Cool Package');
    });

    // skipped: this will be disabled until page is no longer read-only
    it.skip('displays whether or not the package is selected', function() {
      expect(PackageShowPage.isSelected).to.be.true;
    });

    it('displays the content type', function(){
      expect(PackageShowPage.contentType).to.equal('e-book');
    })

    it('displays the total number of titles', function() {
      expect(PackageShowPage.numTitles).to.equal(vendorPackage.titleCount);
    });

    it('displays the number of selected titles', function() {
      expect(PackageShowPage.numTitlesSelected).to.equal(vendorPackage.selectedCount);
    });
  });

  describe("encountering a server error", function() {
    beforeEach(function() {
      this.server.get('/vendors/:vendorId/packages/:packageId', [{
        message: 'There was an error',
        code: "1000",
        subcode: 0
      }], 500);

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it("dies with dignity", function() {
      expect(PackageShowPage.hasErrors).to.be.true;
    });
  });
});

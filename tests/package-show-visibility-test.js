/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageShowVisibility', function() {
  let vendor, pkg;

  beforeEach(function() {
    vendor = this.server.create('vendor', {
      vendorName: 'Cool Vendor'
    });
  });

  describe("visiting the package show page with a hidden package", function() {
    beforeEach(function() {
      pkg = this.server.create('package', 'isHidden', {
        vendor,
        packageName: 'Cool Package',
        contentType: 'e-book'
      });

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the hidden/reason section', function() {
      expect(PackageShowPage.isHidden).to.be.true;
    });
  });

  describe("visiting the package show page with a package that is not hidden", function() {
    beforeEach(function() {
      pkg = this.server.create('package', {
        vendor,
        packageName: 'Cool Package',
        contentType: 'e-book'
      });

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('does not display the hidden/reason section', function() {
      expect(PackageShowPage.isHidden).to.be.false;
    });
  });
});

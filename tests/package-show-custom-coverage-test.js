/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageShowCustomCoverage', function() {
  let vendor, pkg;

  beforeEach(function() {
    vendor = this.server.create('vendor', {
      vendorName: 'Cool Vendor'
    });
  });

  describe("visiting the package show page with custom coverage", function() {
    beforeEach(function() {
      let customCoverage = this.server.create('custom-coverage', {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      });

      pkg = this.server.create('package', {
        customCoverage,
        vendor,
        packageName: 'Cool Package',
        contentType: 'e-book'
      });

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the custom coverage section', function() {
      expect(PackageShowPage.customCoverage).to.equal('7/16/1969 - 12/19/1972');
    });
  });

  describe("visiting the package show page with a package without custom coverage", function() {
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

    it.still('does not display the custom coverage section', function() {
      expect(PackageShowPage.customCoverage).to.equal('');
    });
  });
});

/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageShowCustomCoverage', () => {
  let vendor,
    pkg;

  beforeEach(function () {
    vendor = this.server.create('vendor', {
      name: 'Cool Vendor'
    });
  });

  describe('visiting the package show page with custom coverage', () => {
    beforeEach(function () {
      let customCoverage = this.server.create('custom-coverage', {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      });

      pkg = this.server.create('package', {
        customCoverage,
        vendor,
        packageName: 'Cool Package',
        contentType: 'ebook'
      });

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the custom coverage section', () => {
      expect(PackageShowPage.customCoverage).to.equal('7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the package show page with a package without custom coverage', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        vendor,
        packageName: 'Cool Package',
        contentType: 'ebook'
      });

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it.still('does not display the custom coverage section', () => {
      expect(PackageShowPage.customCoverage).to.equal('');
    });
  });
});

/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageShowVisibility', () => {
  let vendor,
    pkg;

  beforeEach(function () {
    vendor = this.server.create('vendor', {
      name: 'Cool Vendor'
    });
  });

  describe('visiting the package show page with a hidden package', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'isHidden', {
        vendor,
        packageName: 'Cool Package',
        contentType: 'ebook'
      });

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the hidden/reason section', () => {
      expect(PackageShowPage.isHidden).to.be.true;
    });
  });

  describe('visiting the package show page with a package that is not hidden', () => {
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

    it('does not display the hidden/reason section', () => {
      expect(PackageShowPage.isHidden).to.be.false;
    });
  });
});

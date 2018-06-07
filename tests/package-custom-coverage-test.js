import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageCustomCoverage', () => {
  let provider,
    pkg;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });
  });

  describe('visiting the package show page and package is not selected', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: false
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('should not display custom coverage', () => {
      expect(PackageShowPage.hasCustomCoverage).to.be.false;
    });
  });

  describe('visiting the package show page with custom coverage', () => {
    beforeEach(function () {
      let customCoverage = this.server.create('custom-coverage', {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      }).toJSON();

      pkg = this.server.create('package', {
        customCoverage,
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the custom coverage section', () => {
      expect(PackageShowPage.customCoverage).to.equal('7/16/1969 - 12/19/1972');
    });

    it.always('should not display a button to add custom coverage', () => {
      expect(PackageShowPage.$customCoverageButton).to.not.exist;
    });

    it('displays whether or not the package is selected', () => {
      expect(PackageShowPage.isSelected).to.equal(true);
    });

    describe('clicking to toggle and deselect package and confirming deselection', () => {
      beforeEach(() => {
        return PackageShowPage.deselectAndConfirmPackage();
      });

      it('removes the custom coverage', () => {
        expect(PackageShowPage.hasCustomCoverage).to.be.false;
      });
    });

    describe('clicking to toggle and deselect package and canceling deselection', () => {
      beforeEach(() => {
        return PackageShowPage.deselectAndCancelPackage();
      });

      it.always('does not remove the custom coverage', () => {
        expect(PackageShowPage.customCoverage).to.equal('7/16/1969 - 12/19/1972');
      });
    });
  });

  describe('visiting the package show page with a package without custom coverage', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        packageName: 'Cool Package',
        contentType: 'ebook',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it.always('does not display the custom coverage section', () => {
      expect(PackageShowPage.hasCustomCoverage).to.be.false;
    });
  });
});

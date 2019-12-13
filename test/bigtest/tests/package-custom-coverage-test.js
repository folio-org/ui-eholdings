import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';

describe('PackageCustomCoverage', () => {
  setupApplication();
  let provider,
    pkg;

  beforeEach(async function () {
    provider = await this.server.create('provider', {
      name: 'Cool Provider'
    });
  });

  describe('visiting the package show page and package is not selected', () => {
    beforeEach(async function () {
      pkg = await this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: false
      });

      await this.visit(`/eholdings/packages/${pkg.id}`);
      await PackageShowPage.whenLoaded();
    });

    it('should not display custom coverage', () => {
      expect(PackageShowPage.hasCustomCoverage).to.be.false;
    });
  });

  describe('visiting the package show page with custom coverage', () => {
    beforeEach(async function () {
      const customCoverage = await this.server.create('custom-coverage', {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      }).toJSON();

      pkg = await this.server.create('package', {
        customCoverage,
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });

      await this.visit(`/eholdings/packages/${pkg.id}`);
      await PackageShowPage.whenLoaded();
    });

    it('displays the custom coverage section', () => {
      expect(PackageShowPage.customCoverage).to.equal('7/16/1969 - 12/19/1972');
    });

    it.always('should not display a button to add custom coverage', () => {
      expect(PackageShowPage.$customCoverageButton).to.not.exist;
    });

    it('displays whether or not the package is selected', () => {
      expect(PackageShowPage.selectionStatus.isSelected).to.equal(true);
    });

    describe('clicking to toggle and deselect package and confirming deselection', () => {
      beforeEach(async () => {
        await PackageShowPage.deselectAndConfirmPackage();
      });

      it('removes the custom coverage', () => {
        expect(PackageShowPage.hasCustomCoverage).to.be.false;
      });
    });

    describe('clicking to toggle and deselect package and canceling deselection', () => {
      beforeEach(async () => {
        await PackageShowPage.deselectAndCancelPackage();
      });

      it.always('does not remove the custom coverage', () => {
        expect(PackageShowPage.customCoverage).to.equal('7/16/1969 - 12/19/1972');
      });
    });
  });

  describe('visiting the package show page with a package without custom coverage', () => {
    beforeEach(async function () {
      pkg = await this.server.create('package', {
        provider,
        packageName: 'Cool Package',
        contentType: 'ebook',
        isSelected: true
      });

      await this.visit(`/eholdings/packages/${pkg.id}`);
      await PackageShowPage.whenLoaded();
    });

    it.always('does not display the custom coverage section', () => {
      expect(PackageShowPage.hasCustomCoverage).to.be.false;
    });
  });
});

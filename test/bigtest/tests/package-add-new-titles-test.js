import { expect } from 'chai';
import { beforeEach, describe, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';

describe('PackageShowAllowKbToAddTitles', () => {
  setupApplication();
  let provider,
    pkg;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });
  });

  describe('visiting the package show page with a selected package allowing KB to add new titles', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        allowKbToAddTitles: true
      });

      this.visit(`/eholdings/packages/${pkg.id}`);
    });

    it('displays YES for allowing kb to select new titles', () => {
      expect(PackageShowPage.allowKbToAddTitles).to.equal('Yes');
    });
  });

  describe('visiting the package show page with a selected package not allowing KB to add new titles', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        allowKbToAddTitles: false
      });

      this.visit(`/eholdings/packages/${pkg.id}`);
    });

    it('displays NO for allowing kb to select new titles', () => {
      expect(PackageShowPage.allowKbToAddTitles).to.equal('No');
    });
  });

  describe('visiting the package show page with a package that is not selected', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: false
      });

      this.visit(`/eholdings/packages/${pkg.id}`);
    });

    it('sets the state of allow KB to add titles to false', () => {
      expect(PackageShowPage.hasAllowKbToAddTitles).to.be.false;
    });

    it.always('does not display the allow KB to add titles toggle switch', () => {
      expect(PackageShowPage.hasAllowKbToAddTitlesToggle).to.be.false;
    });
  });

  describe('visiting the package show page with a package that is not selected', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: false,
        allowKbToAddTitles: false
      });

      this.visit(`/eholdings/packages/${pkg.id}`);
    });

    describe('selecting a package', () => {
      beforeEach(() => {
        return PackageShowPage.whenLoaded().selectPackage();
      });

      it('reflects the desired state (Selected)', () => {
        expect(PackageShowPage.selectionStatus.isSelected).to.be.true;
      });

      it('displays YES for allowing kb to select new titles', () => {
        expect(PackageShowPage.allowKbToAddTitles).to.equal('Yes');
      });
    });
  });

  describe('visiting the package show page with a package that is selected and de-selecting a package', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: true,
        allowKbToAddTitles: true
      });

      this.visit(`/eholdings/packages/${pkg.id}`);
    });

    it('displays YES for allowing kb to select new titles', () => {
      expect(PackageShowPage.allowKbToAddTitles).to.equal('Yes');
    });

    describe('toggling to deselect a package and confirming deselection', () => {
      beforeEach(() => {
        return PackageShowPage.deselectAndConfirmPackage();
      });

      it('removes allow KB to add titles toggle switch', () => {
        expect(PackageShowPage.hasAllowKbToAddTitlesToggle).to.be.false;
      });
    });

    describe('toggling to deselect a package and canceling deselection', () => {
      beforeEach(() => {
        return PackageShowPage.deselectAndCancelPackage();
      });

      it('displays YES for allowing kb to select new titles', () => {
        expect(PackageShowPage.allowKbToAddTitles).to.equal('Yes');
      });
    });
  });

  describe('visiting the package details page allowing KB to add new titles', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'withTitles', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        allowKbToAddTitles: true,
        titleCount: 5
      });
      this.visit(`/eholdings/packages/${pkg.id}`);
    });

    it('displays YES for allowing kb to select new titles', () => {
      expect(PackageShowPage.allowKbToAddTitles).to.equal('Yes');
    });
  });

  describe('visiting the package details page not allowing KB to add new titles', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'withTitles', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        allowKbToAddTitles: false,
        titleCount: 5
      });
      this.visit(`/eholdings/packages/${pkg.id}`);
    });

    it('displays NO for allowing kb to select new titles', () => {
      expect(PackageShowPage.allowKbToAddTitles).to.equal('No');
    });
  });
});

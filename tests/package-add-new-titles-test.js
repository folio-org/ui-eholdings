import { expect } from 'chai';
import { beforeEach, describe, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/bigtest/package-show';

describeApplication('PackageShowAllowKbToAddTitles', () => {
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

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an ON Toggle', () => {
      expect(PackageShowPage.allowKbToAddTitles).to.be.true;
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

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an OFF Toggle', () => {
      expect(PackageShowPage.allowKbToAddTitles).to.be.false;
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

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
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

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('selecting a package', () => {
      beforeEach(() => {
        return PackageShowPage.toggleIsSelected();
      });

      it('reflects the desired state (Selected)', () => {
        expect(PackageShowPage.isSelected).to.be.true;
      });

      it('displays an ON Toggle for allow KB to add titles', () => {
        expect(PackageShowPage.allowKbToAddTitles).to.be.true;
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

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an ON Toggle', () => {
      expect(PackageShowPage.allowKbToAddTitles).to.be.true;
    });

    describe('toggling to deselect a package and confirming deselection', () => {
      beforeEach(() => {
        return PackageShowPage
          .toggleIsSelected()
          .append(PackageShowPage.modal.confirmDeselection());
      });

      it('removes allow KB to add titles toggle switch', () => {
        expect(PackageShowPage.hasAllowKbToAddTitlesToggle).to.be.false;
      });
    });

    describe('toggling to deselect a package and canceling deselection', () => {
      beforeEach(() => {
        return PackageShowPage
          .toggleIsSelected()
          .append(PackageShowPage.modal.cancelDeselection());
      });

      it('displays an ON Toggle', () => {
        expect(PackageShowPage.allowKbToAddTitles).to.be.true;
      });
    });
  });

  describe('visiting the package details page allowing KB to add new titles and toggling it', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'withTitles', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        allowKbToAddTitles: true,
        titleCount: 5
      });
      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an ON Toggle', () => {
      expect(PackageShowPage.allowKbToAddTitles).to.be.true;
    });

    describe('successfully toggling add new titles', () => {
      beforeEach(() => {
        return PackageShowPage.toggleAllowKbToAddTitles();
      });

      it('reflects the desired state OFF', () => {
        expect(PackageShowPage.allowKbToAddTitles).to.be.false;
      });
    });
  });

  describe('visiting the package details page not allowing KB to add new titles and toggling it', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'withTitles', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        allowKbToAddTitles: false,
        titleCount: 5
      });
      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an OFF Toggle', () => {
      expect(PackageShowPage.allowKbToAddTitles).to.be.false;
    });

    describe('successfully toggling add new titles', () => {
      beforeEach(() => {
        return PackageShowPage.toggleAllowKbToAddTitles();
      });

      it('reflects the desired state ON', () => {
        expect(PackageShowPage.allowKbToAddTitles).to.be.true;
      });
    });
  });
});

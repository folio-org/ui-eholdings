import { beforeEach, afterEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

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
      expect(PackageShowPage.allowKbToAddTitles).to.be.false;
    });

    it.always('does not display the allow KB to add titles toggle switch', () => {
      expect(PackageShowPage.allowKbToAddTitlesToggle).to.not.exist;
    });
  });

  describe('visiting the package show page with a package that is not selected and selecting a package', () => {
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

    beforeEach(function () {
      /*
       * The expectations in the convergent `it` blocks
       * get run once every 10ms.  We were seeing test flakiness
       * when a toggle action dispatched and resolved before an
       * expectation had the chance to run.  We sidestep this by
       * temporarily increasing the mirage server's response time
       * to 50ms.
       * TODO: control timing directly with Mirage
       */
      this.server.timing = 50;
      return PackageShowPage.toggleIsSelected();
    });

    afterEach(function () {
      this.server.timing = 0;
    });

    it('reflects the desired state (Selected)', () => {
      expect(PackageShowPage.isSelected).to.equal(true);
    });

    it('displays an ON Toggle for allow KB to add titles', () => {
      expect(PackageShowPage.allowKbToAddTitles).to.equal(true);
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
        return PackageShowPage.toggleIsSelected().then(() => {
          return PackageShowPage.confirmDeselection();
        });
      });

      it('removes allow KB to add titles toggle switch', () => {
        expect(PackageShowPage.allowKbToAddTitlesToggle).to.not.exist;
      });
    });

    describe('toggling to deselect a package and canceling deselection', () => {
      beforeEach(() => {
        return PackageShowPage.toggleIsSelected().then(() => {
          return PackageShowPage.cancelDeselection();
        });
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
      beforeEach(function () {
        this.server.timing = 50;
        return PackageShowPage.toggleAllowKbToAddTitles();
      });

      afterEach(function () {
        this.server.timing = 0;
      });

      it('reflects the desired state OFF', () => {
        expect(PackageShowPage.allowKbToAddTitles).to.equal(false);
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
      beforeEach(function () {
        this.server.timing = 50;
        return PackageShowPage.toggleAllowKbToAddTitles();
      });

      afterEach(function () {
        this.server.timing = 0;
      });

      it('reflects the desired state ON', () => {
        expect(PackageShowPage.allowKbToAddTitles).to.equal(true);
      });
    });
  });
});

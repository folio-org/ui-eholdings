/* global describe, beforeEach, afterEach */
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

  describe('visiting the package show page with a hidden package with a hidden reason', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'isHidden', {
        vendor,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an OFF Toggle (Hidden from patrons)', () => {
      expect(PackageShowPage.isHidden).to.be.true;
    });

    it('displays the hidden/reason section', () => {
      expect(PackageShowPage.isHiddenMessage).to.be.true;
    });
  });

  describe('visiting the package show page with a hidden package without a hidden reason', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'isHiddenWithoutReason', {
        vendor,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an OFF Toggle (Hidden from patrons)', () => {
      expect(PackageShowPage.isHidden).to.be.true;
    });

    it('does not displays the hidden/reason section', () => {
      expect(PackageShowPage.isHiddenMessage).to.be.false;
    });
  });

  describe('visiting the package show page with a package that is not hidden', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        vendor,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an ON Toggle (Visible to patrons)', () => {
      expect(PackageShowPage.isHidden).to.be.false;
    });

    it('does not display the hidden/reason section', () => {
      expect(PackageShowPage.isHiddenMessage).to.be.false;
    });
  });

  describe('visiting the package show page with a package that is not selected', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        vendor,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: false
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an ON Toggle (Visible to patrons)', () => {
      expect(PackageShowPage.isHidden).to.be.false;
    });

    it('displays a disabled Toggle', () => {
      expect(PackageShowPage.isHiddenToggleable).to.equal(false);
    });

    it('does not display the hidden/reason section', () => {
      expect(PackageShowPage.isHiddenMessage).to.be.false;
    });
  });

  describe('visiting the package details page and Hiding a Package', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'withTitles', {
        vendor,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        titleCount: 5
      });
      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an ON Toggle (Visible to patrons)', () => {
      expect(PackageShowPage.isHidden).to.be.false;
    });

    describe('successfully hiding a package', () => {
      beforeEach(function () {
        this.server.timing = 50;
        return PackageShowPage.toggleIsHidden();
      });

      afterEach(function () {
        this.server.timing = 0;
      });
      it('reflects the desired state OFF (Hidden from patrons)', () => {
        expect(PackageShowPage.isHidden).to.equal(true);
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(PackageShowPage.isHiddenToggleable).to.equal(false);
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state OFF (Hidden from patrons)', () => {
          expect(PackageShowPage.isHidden).to.equal(true);
        });

        it('indicates it is no longer pending', () => {
          expect(PackageShowPage.isHiding).to.equal(false);
        });

        it('shows the package titles are all hidden', () => {
          expect(PackageShowPage.allTitlesHidden).to.equal(true);
        });
      });
    });
  });

  describe('visiting the package details page and Showing a Package', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'isHidden', 'withTitles', {
        vendor,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        titleCount: 5
      });
      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('reflects the desired initial state OFF (Hidden from patrons)', () => {
      expect(PackageShowPage.isHidden).to.be.true;
    });
    describe('successfully showing a package', () => {
      beforeEach(function () {
        this.server.timing = 50;
        return PackageShowPage.toggleIsHidden();
      });

      afterEach(function () {
        this.server.timing = 0;
      });
      it('displays an ON Toggle (Visible to patrons)', () => {
        expect(PackageShowPage.isHidden).to.equal(false);
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(PackageShowPage.isHiddenToggleable).to.equal(false);
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state as ON Toggle (Visible to patrons)', () => {
          expect(PackageShowPage.isHidden).to.equal(false);
        });

        it('indicates it is no longer pending', () => {
          expect(PackageShowPage.isHiding).to.equal(false);
        });

        it('should show the package titles are all not hidden', () => {
          expect(PackageShowPage.allTitlesHidden).to.equal(false);
        });
      });
    });
  });
});

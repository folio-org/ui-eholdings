import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageVisibility', () => {
  let provider,
    pkg;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });
  });

  describe('visiting the package show page with a hidden package with a hidden reason', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'isHidden', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an OFF toggle (Hidden from patrons)', () => {
      expect(PackageShowPage.isVisibleToPatrons).to.be.false;
    });

    it('displays the hidden/reason section', () => {
      expect(PackageShowPage.isHiddenMessage).to.equal('The content is for mature audiences only.');
    });
  });

  describe('visiting the package show page with a hidden package without a hidden reason', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'isHiddenWithoutReason', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an OFF toggle (Hidden from patrons)', () => {
      expect(PackageShowPage.isVisibleToPatrons).to.be.false;
    });

    it('does not display the hidden/reason section', () => {
      expect(PackageShowPage.isHiddenMessagePresent).to.be.false;
    });
  });

  describe('visiting the package show page with a package that is not hidden', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an ON toggle (Visible to patrons)', () => {
      expect(PackageShowPage.isVisibleToPatrons).to.be.true;
    });

    it.always('does not display the hidden/reason section', () => {
      expect(PackageShowPage.isHiddenMessagePresent).to.be.false;
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

    it('does not display a toggle', () => {
      expect(PackageShowPage.isHiddenTogglePresent).to.be.false;
    });

    it.always('does not display the hidden/reason section', () => {
      expect(PackageShowPage.isHiddenMessagePresent).to.be.false;
    });
  });

  describe('visiting the package details page and Hiding a Package', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'withTitles', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        titleCount: 5
      });
      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays an ON toggle (Visible to patrons)', () => {
      expect(PackageShowPage.isVisibleToPatrons).to.be.true;
    });

    describe('successfully hiding a package', () => {
      beforeEach(() => {
        return PackageShowPage.toggleIsHidden();
      });

      it('reflects the desired state OFF (Hidden from patrons)', () => {
        expect(PackageShowPage.isVisibleToPatrons).to.be.false;
      });

      it.skip('cannot be interacted with while the request is in flight', () => {
        expect(PackageShowPage.isHiddenToggleDisabled).to.be.true;
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state OFF (Hidden from patrons)', () => {
          expect(PackageShowPage.isVisibleToPatrons).to.be.false;
        });

        it('indicates it is no longer pending', () => {
          expect(PackageShowPage.isHiding).to.be.false;
        });

        it('shows the package titles are all hidden', () => {
          expect(PackageShowPage.allTitlesHidden).to.be.true;
        });
      });
    });
  });

  describe('visiting the package details page and Showing a Package', () => {
    beforeEach(function () {
      pkg = this.server.create('package', 'isHidden', 'withTitles', {
        provider,
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
      expect(PackageShowPage.isVisibleToPatrons).to.be.false;
    });

    describe('successfully showing a package', () => {
      beforeEach(() => {
        return PackageShowPage.toggleIsHidden();
      });

      it('displays an ON Toggle (Visible to patrons)', () => {
        expect(PackageShowPage.isVisibleToPatrons).to.be.true;
      });

      it.skip('cannot be interacted with while the request is in flight', () => {
        expect(PackageShowPage.isHiddenToggleDisabled).to.be.true;
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state as ON Toggle (Visible to patrons)', () => {
          expect(PackageShowPage.isVisibleToPatrons).to.be.true;
        });

        it('indicates it is no longer pending', () => {
          expect(PackageShowPage.isHiding).to.be.false;
        });

        it('should show the package titles are all not hidden', () => {
          expect(PackageShowPage.allTitlesHidden).to.be.false;
        });
      });
    });
  });
});

import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from '../helpers/describe-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describeApplication('ManagedPackageEditVisibility', () => {
  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });
  });

  describe('visiting the package edit page with a hidden package and a hidden reason', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', 'isHidden', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });
      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('displays the correct visibility status', () => {
      expect(PackageEditPage.isVisibleToPatrons).to.equal(false);
    });

    it('displays the hidden/reason section', () => {
      expect(PackageEditPage.isHiddenMessage).to.equal('The content is for mature audiences only.');
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('toggling the visiblity field', () => {
      beforeEach(() => {
        return PackageEditPage.toggleIsVisible();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('displays the new visibility status', () => {
          expect(PackageShowPage.isVisibleToPatrons).to.equal('Yes');
        });
      });
    });
  });

  describe('visiting the package edit page with a hidden package without a hidden reason', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', 'isHiddenWithoutReason', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });
      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('displays the correct visibility status', () => {
      expect(PackageEditPage.isVisibleToPatrons).to.be.false;
    });

    it('does not display the hidden/reason section', () => {
      expect(PackageEditPage.isHiddenMessagePresent).to.be.false;
    });
  });

  describe('visiting the package edit page with a package that is not hidden', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        isVisible: true
      });
      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('displays the correct visibility status', () => {
      expect(PackageEditPage.isVisibleToPatrons).to.be.true;
    });

    it('does not display hidden message', () => {
      expect(PackageEditPage.isHiddenMessagePresent).to.equal(false);
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('toggling the visiblity field', () => {
      beforeEach(() => {
        return PackageEditPage.toggleIsVisible();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('displays the new visibility status', () => {
          expect(PackageShowPage.isVisibleToPatrons).to.equal('No');
        });
      });
    });
  });

  describe('visiting the package edit page with a deselected package', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: false,
        isVisible: false
      });
      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('reflects the desired state of holding status', () => {
      expect(PackageEditPage.isSelected).to.equal(false);
    });

    it('visibility field is not present', () => {
      expect(PackageEditPage.isVisibilityFieldPresent).to.equal(false);
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSavePresent).to.equal(false);
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });
  });
});

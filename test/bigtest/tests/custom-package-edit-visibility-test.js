import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe('CustomPackageEditVisibility', () => {
  setupApplication();
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
        isCustom: true,
      });
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('displays the correct visibility status', () => {
      expect(PackageEditPage.isVisibleToPatrons).to.be.false;
    });

    it('displays the hidden/reason section', () => {
      expect(PackageEditPage.isHiddenMessage).to.equal('The content is for mature audiences only.');
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking close (navigate back) button', () => {
      beforeEach(() => {
        return PackageEditPage.clickBackButton();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('toggling the visiblity field', () => {
      beforeEach(async () => {
        await PackageEditPage.whenLoaded();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.toggleIsVisible().clickBackButton();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.toggleIsVisible().clickSave();
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
        isCustom: true,
      });
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
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
        isCustom: true,
        isVisible: true
      });
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
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

    describe('clicking close (navigate back) button', () => {
      beforeEach(() => {
        return PackageEditPage.clickBackButton();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('toggling the visiblity field', () => {
      beforeEach(async () => {
        await PackageEditPage.whenLoaded();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.toggleIsVisible().clickBackButton();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.toggleIsVisible().clickSave();
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

  describe('visiting the package edit page with a custom (default selected) package', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isCustom: true,
        isVisible: true,
      });
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });
    it('reflects the desired state of holding status', () => {
      expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });
  });
});

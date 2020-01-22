import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe('ManagedPackageEditAllowKbToAddTitles', () => {
  setupApplication();
  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });
  });

  describe('visiting the package edit page with allowing KB to add new titles on', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        allowKbToAddTitles: true
      });

      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('allowKbToAddTitles is selected to be true', () => {
      expect(PackageEditPage.allowKbToAddTitlesRadio).to.be.true;
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

    describe('changing the allowKbToAddTitles selection', () => {
      beforeEach(() => {
        return PackageEditPage.clickDisallowKbToAddTitlesRadio();
      });

      describe('clicking close (navigate back) button', () => {
        beforeEach(() => {
          return PackageEditPage.clickBackButton();
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

        it('displays the new allowKbToAddTitles status', () => {
          expect(PackageShowPage.allowKbToAddTitles).to.equal('No');
        });
      });
    });
  });

  describe('visiting the package edit page with allowing KB to add new titles off', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        allowKbToAddTitles: false
      });
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('allowKbToAddTitles is selected to no', () => {
      expect(PackageEditPage.allowKbToAddTitlesRadio).to.be.false;
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

    describe('toggling the allowKbToAddTitles toggle', () => {
      beforeEach(() => {
        return PackageEditPage.clickAllowKbToAddTitlesRadio();
      });

      describe('clicking close (navigate back) button', () => {
        beforeEach(() => {
          return PackageEditPage.clickBackButton();
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

        it('displays the new allowKbToAddTitles status', () => {
          expect(PackageShowPage.allowKbToAddTitles).to.equal('Yes');
        });
      });
    });
  });

  describe('visiting the package edit page with a package that is not selected', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: false,
        allowKbToAddTitles: false
      });
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('redirects to the package show page', () => {
      expect(PackageShowPage.$root).to.exist;
    });
  });
});

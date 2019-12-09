import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe('ManagedPackageEditAllowKbToAddTitles', function () {
  setupApplication();
  // some of the beforeEach blocks seem to timeout in CI
  this.timeout(5000);

  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });
  });

  describe('visiting the package edit page with allowing KB to add new titles on', () => {
    beforeEach(async function () {
      providerPackage = await this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        allowKbToAddTitles: true
      });

      await this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
      await PackageEditPage.whenLoaded();
    });

    it('allowKbToAddTitles is selected to be true', () => {
      expect(PackageEditPage.allowKbToAddTitlesRadio).to.be.true;
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(async () => {
        await PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('changing the allowKbToAddTitles selection', () => {
      beforeEach(async () => {
        await PackageEditPage.clickDisallowKbToAddTitlesRadio();
      });

      describe('clicking cancel', () => {
        beforeEach(async () => {
          await PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(async () => {
          await PackageEditPage.clickSave();
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
    beforeEach(async function () {
      providerPackage = await this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        allowKbToAddTitles: false
      });
      await this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
      await PackageEditPage.whenLoaded();
    });

    it('allowKbToAddTitles is selected to no', () => {
      expect(PackageEditPage.allowKbToAddTitlesRadio).to.be.false;
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(async () => {
        await PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('toggling the allowKbToAddTitles toggle', () => {
      beforeEach(async () => {
        await PackageEditPage.clickAllowKbToAddTitlesRadio();
      });

      describe('clicking cancel', () => {
        beforeEach(async () => {
          await PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(async () => {
          await PackageEditPage.clickSave();
          await PackageShowPage.whenLoaded();
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
    beforeEach(async function () {
      providerPackage = await this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: false,
        allowKbToAddTitles: false
      });
      await this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
      await PackageEditPage.whenLoaded();
    });

    it.always('does not display the allow KB to add titles toggle switch', () => {
      expect(PackageEditPage.hasRadioForAllowKbToAddTitles).to.equal(false);
    });

    it('hides the save button', () => {
      expect(PackageEditPage.isSavePresent).to.equal(false);
    });

    describe('toggling the selected toggle', () => {
      beforeEach(() => {
        return PackageEditPage.clickAddButton();
      });

      it('reflects the desired state (Selected)', () => {
        expect(PackageEditPage.selectionStatus.isSelected).to.be.true;
      });

      it('allow KB to add titles is selected true', () => {
        expect(PackageEditPage.allowKbToAddTitlesRadio).to.be.true;
      });
    });
  });
});

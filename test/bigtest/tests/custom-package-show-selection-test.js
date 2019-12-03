import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import setupBlockServer from '../helpers/setup-block-server';
import PackageShowPage from '../interactors/package-show';

// This test though named custom package show is essentially a Package
// and uses most of the same components as a Package.
// However, there are some nuances between that of a Package and CustomPackage
// so those are excersised in this test.

describe('CustomPackageShowSelection', () => {
  setupApplication();

  let provider,
    providerPackage;

  beforeEach(async function () {
    await setupBlockServer(this.server);

    provider = await this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = await this.server.create('package', 'withTitles', {
      provider,
      name: 'Cool Custom Package',
      contentType: 'E-Book',
      isCustom: true
    });
  });

  describe('visiting the package details page', () => {
    beforeEach(async function () {
      await this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('automatically has the custom package in my holdings', () => {
      expect(PackageShowPage.selectionStatus.isSelected).to.equal(true);
    });

    describe('deselecting a custom package', () => {
      beforeEach(() => {
        return PackageShowPage
          .dropDown.clickDropDownButton()
          .dropDownMenu.removeFromHoldings.click();
      });

      describe('canceling the deselection', () => {
        beforeEach(() => {
          return PackageShowPage.modal.cancelDeselection();
        });

        it('reverts back to the selected state', () => {
          expect(PackageShowPage.selectionStatus.isSelected).to.equal(true);
        });
      });

      describe('confirming the deselection when the request succeeds', () => {
        beforeEach(async function () {
          await this.server.block();
          await PackageShowPage.modal.confirmDeselection();
          await this.server.unblock();
          await PackageShowPage
            .when(() => !PackageShowPage.isSelecting);
        });

        it('removes package detail pane', () => {
          expect(PackageShowPage.isPresent).to.equal(false);
        });
      });
    });

    // when you are deleting you are hitting the delete endpoint and not put
    // put is only on updating a custom packge.

    describe('unsuccessfully deselecting a custom package', () => {
      beforeEach(async function () {
        await this.server.delete('/packages/:packageId', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);

        return PackageShowPage
          .dropDown.clickDropDownButton()
          .dropDownMenu.removeFromHoldings.click();
      });

      it('shows a confirmation dialog', () => {
        expect(PackageShowPage.modal.isVisible).to.equal(true);
      });

      describe('confirming the deselection', () => {
        beforeEach(() => {
          return PackageShowPage.modal.confirmDeselection();
        });

        it('reflect the desired state was not set', () => {
          expect(PackageShowPage.selectionStatus.isSelected).to.equal(true);
        });

        it('indicates it is no longer working', () => {
          expect(PackageShowPage.selectionStatus.isSelecting).to.equal(false);
        });

        it('shows the error as a toast', () => {
          expect(PackageShowPage.toast.errorText).to.equal('There was an error');
        });
      });
    });
  });
});

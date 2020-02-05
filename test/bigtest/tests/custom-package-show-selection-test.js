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

  beforeEach(function () {
    setupBlockServer(this.server);

    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Cool Custom Package',
      contentType: 'E-Book',
      isCustom: true
    });
  });

  describe('visiting the package details page', () => {
    beforeEach(function () {
      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('automatically has the custom package in my holdings', () => {
      expect(PackageShowPage.selectionStatus.isSelected).to.equal(true);
    });

    describe('deselecting a custom package', () => {
      beforeEach(() => {
        return PackageShowPage
          .actionsDropDown.clickDropDownButton()
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

      describe('confirming the deselection', () => {
        beforeEach(function () {
          this.server.block();
          return PackageShowPage.modal.confirmDeselection();
        });

        it('indicates it is working to get to desired state', () => {
          expect(PackageShowPage.selectionStatus.isSelecting).to.equal(true);
        });

        describe('when the request succeeds', () => {
          beforeEach(function () {
            this.server.unblock();
            return PackageShowPage
              .when(() => !PackageShowPage.isSelecting);
          });

          it('removes package detail pane', () => {
            expect(PackageShowPage.isPresent).to.equal(false);
          });
        });
      });
    });

    // when you are deleting you are hitting the delete endpoint and not put
    // put is only on updating a custom packge.

    describe('unsuccessfully deselecting a custom package', () => {
      beforeEach(function () {
        this.server.delete('/packages/:packageId', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);

        return PackageShowPage
          .actionsDropDown.clickDropDownButton()
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

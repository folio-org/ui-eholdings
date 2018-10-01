import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe('CustomPackageEditSelection', () => {
  setupApplication();
  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isCustom: true
    });
  });

  describe('visiting the package edit page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('displays the correct holdings status (ON)', () => {
      expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
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

    describe('deleting the custom package', () => {
      beforeEach(() => {
        return PackageEditPage
          .dropDown.clickDropDownButton()
          .dropDownMenu.removeFromHoldings.click();
      });

      it('shows the deletion confirmation modal', () => {
        expect(PackageEditPage.modal.isPresent).to.equal(true);
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.modal.cancelDeselection();
        });

        it('should stay on the edit page', () => {
          expect(PackageEditPage.isPresent).to.equal(true);
        });

        it('reflects that the package is still selected', () => {
          expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
        });
      });

      describe('clicking confirm', () => {
        let resolveRequest;

        beforeEach(function () {
          this.server.delete('/packages/:id', () => {
            return new Promise((resolve) => {
              resolveRequest = resolve;
            });
          });

          return PackageEditPage.modal.confirmDeselection();
        });

        it('should keep confirmation modal on screen until requests responds', () => {
          expect(PackageEditPage.modal.isPresent).to.equal(true);
        });

        it('confirmation button now reads "deleting"', () => {
          expect(PackageEditPage.modal.confirmButtonText).to.equal('Deleting...');
          resolveRequest();
        });

        it('confirmation button is disabled', () => {
          expect(PackageEditPage.modal.confirmButtonIsDisabled).to.equal(true);
        });

        describe('when the request resolves', () => {
          beforeEach(() => {
            return resolveRequest();
          });

          it('transitions to the package search page', function () {
            expect(this.app.history.location.search).to.include('?searchType=packages');
          });
        });
      });
    });
  });
});

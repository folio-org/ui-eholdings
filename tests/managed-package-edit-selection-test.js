import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';
import PackageEditPage from './pages/package-edit';

describeApplication('ManagedPackageEditSelection', () => {
  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });
  });

  describe('visiting the package edit page with an unselected package', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: false
      });
      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('reflects the desired state of holding status', () => {
      expect(PackageEditPage.isSelected).to.equal(false);
    });

    it('shows "Add to holdings" button', () => {
      expect(PackageEditPage.hasAddButton).to.equal(true);
    });

    it('cannot toggle visibility', () => {
      expect(PackageEditPage.isVisibilityFieldPresent).to.equal(false);
    });

    it('cannot select allow kb to add titles', () => {
      expect(PackageEditPage.hasRadioForAllowKbToAddTitles).to.equal(false);
    });

    it('cannot edit coverage', () => {
      expect(PackageEditPage.hasCoverageDatesPresent).to.equal(false);
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

    describe('selecting the package', () => {
      describe('via "Add to holdings" button', () => {
        beforeEach(() => {
          return PackageEditPage.clickAddButton();
        });

        it('stays on the edit page', () => {
          expect(PackageEditPage.isPresent).to.equal(true);
        });

        it('reflects that the package has been selected', () => {
          expect(PackageEditPage.isSelected).to.equal(true);
        });

        it('should not need the form to be submitted', () => {
          expect(PackageEditPage.isSaveDisabled).to.equal(true);
        });
      });

      describe('via dropdown action', () => {
        beforeEach(() => {
          return PackageEditPage
            .dropDown.clickDropDownButton()
            .dropDownMenu.clickAddToHoldings();
        });

        it('stays on the edit page', () => {
          expect(PackageEditPage.isPresent).to.equal(true);
        });

        it('reflects that the package has been selected', () => {
          expect(PackageEditPage.isSelected).to.equal(true);
        });

        it('should not need the form to be submitted', () => {
          expect(PackageEditPage.isSaveDisabled).to.equal(true);
        });
      });
    });
  });

  describe('visiting the package edit page with a selected package', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });
      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('reflects the desired state of holding status', () => {
      expect(PackageEditPage.isSelected).to.equal(true);
    });

    it('hides "Add to holdings" button', () => {
      expect(PackageEditPage.hasAddButton).to.equal(false);
    });

    it('can toggle visibility', () => {
      expect(PackageEditPage.isVisibilityFieldPresent).to.equal(true);
    });

    it('can select allow kb to add titles', () => {
      expect(PackageEditPage.hasRadioForAllowKbToAddTitles).to.equal(true);
    });

    it('can edit coverage', () => {
      expect(PackageEditPage.hasCoverageDatesPresent).to.equal(true);
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

    describe('deselecting the package', () => {
      beforeEach(() => {
        return PackageEditPage
          .dropDown.clickDropDownButton()
          .dropDownMenu.clickRemoveFromHoldings();
      });

      it('shows the deselection confirmation modal', () => {
        expect(PackageEditPage.modal.isPresent).to.equal(true);
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.modal.cancelDeselection();
        });

        it('should stay on the edit page', () => {
          expect(PackageEditPage.isPresent).to.equal(true);
        });

        it('reflects the desired state of holding status', () => {
          expect(PackageEditPage.isSelected).to.equal(true);
        });
      });

      describe('clicking confirm', () => {
        let resolveRequest;

        beforeEach(function () {
          this.server.put('/packages/:id', () => {
            return new Promise((resolve) => {
              resolveRequest = resolve;
            });
          });

          return PackageEditPage.modal.confirmDeselection();
        });

        it('should keep confirmation modal on screen until requests responds', () => {
          expect(PackageEditPage.modal.isPresent).to.equal(true);
        });

        it('confirmation button now reads "removing"', () => {
          expect(PackageEditPage.modal.confirmButtonText).to.equal('Removing...');
          resolveRequest();
        });

        it('confirmation button is disabled', () => {
          expect(PackageEditPage.modal.confirmButtonIsDisabled).to.equal(true);
        });

        describe('when request resolves', () => {
          beforeEach(() => {
            return resolveRequest();
          });

          it('goes to the resource show page', () => {
            expect(PackageShowPage.$root).to.exist;
            expect(PackageShowPage.hasTitleList).to.equal(true);
          });
        });
      });
    });
  });
});

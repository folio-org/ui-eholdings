import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import setupBlockServer from '../helpers/setup-block-server';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe('ManagedPackageEditSelection', () => {
  setupApplication();
  let provider,
    providerPackage;

  beforeEach(function () {
    setupBlockServer(this.server);
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
      expect(PackageEditPage.selectionStatus.isSelected).to.equal(false);
    });

    it('shows "Add to holdings" button', () => {
      expect(PackageEditPage.selectionStatus.hasAddButton).to.equal(true);
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
          expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
        });

        it('should not need the form to be submitted', () => {
          expect(PackageEditPage.isSaveDisabled).to.equal(true);
        });
      });

      describe('via dropdown action', () => {
        beforeEach(() => {
          return PackageEditPage
            .dropDown.clickDropDownButton()
            .dropDownMenu.addToHoldings.click();
        });

        it('stays on the edit page', () => {
          expect(PackageEditPage.isPresent).to.equal(true);
        });

        it('reflects that the package has been selected', () => {
          expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
        });

        it('should not need the form to be submitted', () => {
          expect(PackageEditPage.isSaveDisabled).to.equal(true);
        });
      });
    });
  });

  describe('visiting the package edit page with a totally selected package', () => {
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
      expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
    });

    it('hides "Add to holdings" button', () => {
      expect(PackageEditPage.selectionStatus.hasAddButton).to.equal(false);
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
          .dropDownMenu.removeFromHoldings.click();
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
          expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
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

  describe('visiting the package edit page with a partially selected package', () => {
    let pkg;
    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        name: 'Partial Package',
        selectedCount: 5,
        titleCount: 10
      });
      this.server.createList('resource', 5, 'withTitle', {
        package: pkg,
        isSelected: true
      });
      this.server.createList('resource', 5, 'withTitle', {
        package: pkg,
        isSelected: false
      });
      return this.visit(`/eholdings/packages/${pkg.id}/edit`);
    });
    it('shows the selected # of titles and the total # of titles in the package', () => {
      expect(PackageEditPage.selectionStatus.text).to.equal('5 of 10 titles selected');
    });
    it('shows add all to holdings button', () => {
      expect(PackageEditPage.selectionStatus.buttonText).to.equal('Add all to holdings');
    });
    describe('inspecting the menu', () => {
      beforeEach(() => {
        return PackageEditPage.dropDown.clickDropDownButton();
      });
      it('has menu item to add all remaining titles from this packages', () => {
        expect(PackageEditPage.dropDownMenu.addToHoldings.text).to.equal('Add all to holdings');
      });
      it('has menu item to remove the entire package from holdings just like a completely selected packages', () => {
        expect(PackageEditPage.dropDownMenu.removeFromHoldings.isVisible).to.equal(true);
      });
    });
    describe('clicking the menu item to add all to holdings', () => {
      beforeEach(function () {
        this.server.block();
        return PackageEditPage.selectPackage();
      });
      it.skip('indicates it is working to get to desired state', () => {
        expect(PackageEditPage.selectionStatus.isSelecting).to.equal(true);
      });
      describe('when the request succeeds', () => {
        beforeEach(function () {
          return this.server.unblock();
        });
        it('reflects that the package has been selected', () => {
          expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
        });
        describe('inspecting the menu', () => {
          beforeEach(() => {
            return PackageEditPage.dropDown.clickDropDownButton();
          });
          it('does not have menu item to add all to holdings', () => {
            expect(PackageEditPage.dropDownMenu.addToHoldings.isPresent).to.equal(false);
          });
          it('has menu item to remove the entire package from holdings', () => {
            expect(PackageEditPage.dropDownMenu.removeFromHoldings.isVisible).to.equal(true);
          });
        });
      });
    });
    describe('clicking the "Add all to holdings" button', () => {
      beforeEach(function () {
        this.server.block();
        return PackageEditPage.selectPackage();
      });
      it.skip('indicates it is working to get to desired state', () => {
        expect(PackageEditPage.selectionStatus.isSelecting).to.equal(true);
      });
      describe('when the request succeeds', () => {
        beforeEach(function () {
          return this.server.unblock();
        });
        it('reflects that the package has been selected', () => {
          expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
        });
        describe('inspecting the menu', () => {
          beforeEach(() => {
            return PackageEditPage.dropDown.clickDropDownButton();
          });
          it('does not have menu item to add all to holdings', () => {
            expect(PackageEditPage.dropDownMenu.addToHoldings.isPresent).to.equal(false);
          });
          it('has menu item to remove the entire package from holdings', () => {
            expect(PackageEditPage.dropDownMenu.removeFromHoldings.isVisible).to.equal(true);
          });
        });
      });
    });
  });
});

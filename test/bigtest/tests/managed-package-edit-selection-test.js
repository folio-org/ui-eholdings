import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import setupBlockServer from '../helpers/setup-block-server';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe.skip('ManagedPackageEditSelection', function () {
  setupApplication();
  // some of the beforeEach blocks seem to timeout in CI
  this.timeout(5000);
  let provider,
    providerPackage;

  beforeEach(async function () {
    await setupBlockServer(this.server);
    provider = await this.server.create('provider', {
      name: 'Cool Provider'
    });
  });

  describe('visiting the package edit page with an unselected package', () => {
    beforeEach(async function () {
      providerPackage = await this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: false
      });
      await this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
      await PackageEditPage.whenLoaded();
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
      beforeEach(async () => {
        await PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('selecting the package', () => {
      beforeEach(async () => {
        await PackageEditPage.whenLoaded();
      });

      describe('via "Add to holdings" button', () => {
        beforeEach(async () => {
          await PackageEditPage.clickAddButton();
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
        beforeEach(async () => {
          await PackageEditPage.dropDown.clickDropDownButton();
          await PackageEditPage.dropDownMenu.addToHoldings.click();
        });

        it('stays on the edit page', () => {
          expect(PackageEditPage.isPresent).to.equal(true);
        });

        it('reflects that the package has been selected', () => {
          expect(PackageEditPage.selectionStatus.isSelected).to.be.true;
        });

        it('should not need the form to be submitted', () => {
          expect(PackageEditPage.isSaveDisabled).to.be.true;
        });
      });
    });
  });

  describe('visiting the package edit page with a totally selected package', () => {
    beforeEach(async function () {
      providerPackage = await this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });
      await this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
      await PackageEditPage.whenLoaded();
    });

    describe('holding status section', () => {
      it('displays title', () => {
        expect(PackageEditPage.holdingStatusSectionAccordion.label).to.equal('Holding status');
      });

      it('is expanded by default', () => {
        expect(PackageEditPage.holdingStatusSectionAccordion.isOpen).to.equal(true);
      });

      describe('clicking the header', () => {
        beforeEach(async () => {
          await PackageEditPage.holdingStatusSectionAccordion.clickHeader();
        });

        it('collapses the section', () => {
          expect(PackageEditPage.holdingStatusSectionAccordion.isOpen).to.be.false;
        });

        describe('clicking the header again', () => {
          beforeEach(async () => {
            await PackageEditPage.holdingStatusSectionAccordion.clickHeader();
          });

          it('expands the section', () => {
            expect(PackageEditPage.holdingStatusSectionAccordion.isOpen).to.be.true;
          });
        });
      });

      it('reflects the desired state of holding status', () => {
        expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
      });

      it('has hidden "Add to holdings" button', () => {
        expect(PackageEditPage.selectionStatus.hasAddButton).to.equal(false);
      });
    });

    describe('package settings section', () => {
      it('displays title', () => {
        expect(PackageEditPage.settingsSectionAccordion.label).to.equal('Package settings');
      });

      it('is expanded by default', () => {
        expect(PackageEditPage.settingsSectionAccordion.isOpen).to.equal(true);
      });

      describe('clicking the header', () => {
        beforeEach(async () => {
          await PackageEditPage.holdingStatusSectionAccordion.clickHeader();
        });

        it('collapses the section', () => {
          expect(PackageEditPage.holdingStatusSectionAccordion.isOpen).to.be.false;
        });

        describe('clicking the header again', () => {
          beforeEach(async () => {
            await PackageEditPage.holdingStatusSectionAccordion.clickHeader();
          });

          it('expands the section', () => {
            expect(PackageEditPage.holdingStatusSectionAccordion.isOpen).to.be.true;
          });
        });
      });

      it('can toggle visibility', () => {
        expect(PackageEditPage.isVisibilityFieldPresent).to.equal(true);
      });

      it('can select allow kb to add titles', () => {
        expect(PackageEditPage.hasRadioForAllowKbToAddTitles).to.equal(true);
      });
    });

    describe('coverage settings section', () => {
      it('displays title', () => {
        expect(PackageEditPage.coverageSettingsSectionAccordion.label).to.equal('Coverage settings');
      });

      it('is expanded by default', () => {
        expect(PackageEditPage.coverageSettingsSectionAccordion.isOpen).to.equal(true);
      });

      describe('clicking the header', () => {
        beforeEach(async () => {
          await PackageEditPage.holdingStatusSectionAccordion.clickHeader();
        });

        it('collapses the section', () => {
          expect(PackageEditPage.holdingStatusSectionAccordion.isOpen).to.be.false;
        });

        describe('clicking the header again', () => {
          beforeEach(async () => {
            await PackageEditPage.holdingStatusSectionAccordion.clickHeader();
          });

          it('expands the section', () => {
            expect(PackageEditPage.holdingStatusSectionAccordion.isOpen).to.be.true;
          });
        });
      });

      it('can edit coverage', () => {
        expect(PackageEditPage.hasCoverageDatesPresent).to.equal(true);
      });
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking the "collapse all" button', () => {
      beforeEach(async () => {
        await PackageEditPage.sectionToggleButton.click();
      });

      it('collapses all sections', () => {
        expect(PackageEditPage.holdingStatusSectionAccordion.isOpen).to.equal(false);
        expect(PackageEditPage.settingsSectionAccordion.isOpen).to.equal(false);
        expect(PackageEditPage.coverageSettingsSectionAccordion.isOpen).to.equal(false);
      });

      describe('clicking the "expand all" button ', () => {
        beforeEach(async () => {
          await PackageEditPage.sectionToggleButton.click();
        });

        it('expands all sections', () => {
          expect(PackageEditPage.holdingStatusSectionAccordion.isOpen).to.equal(true);
          expect(PackageEditPage.settingsSectionAccordion.isOpen).to.equal(true);
          expect(PackageEditPage.coverageSettingsSectionAccordion.isOpen).to.equal(true);
        });
      });
    });

    describe('clicking cancel', () => {
      beforeEach(async () => {
        await PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('deselecting the package', () => {
      beforeEach(async () => {
        await PackageEditPage.dropDown.clickDropDownButton();
        await PackageEditPage.dropDownMenu.removeFromHoldings.click();
      });

      it('shows the deselection confirmation modal', () => {
        expect(PackageEditPage.modal.isPresent).to.equal(true);
      });

      describe('clicking cancel', () => {
        beforeEach(async () => {
          await PackageEditPage.modal.cancelDeselection();
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

        beforeEach(async function () {
          await this.server.put('/packages/:id', () => {
            return new Promise((resolve) => {
              resolveRequest = resolve;
            });
          });

          await PackageEditPage.modal.confirmDeselection();
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
          beforeEach(async () => {
            await resolveRequest();
            await PackageShowPage.whenLoaded();
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
    beforeEach(async function () {
      pkg = await this.server.create('package', {
        provider,
        name: 'Partial Package',
        selectedCount: 5,
        titleCount: 10
      });
      await this.server.createList('resource', 5, 'withTitle', {
        package: pkg,
        isSelected: true
      });
      await this.server.createList('resource', 5, 'withTitle', {
        package: pkg,
        isSelected: false
      });
      await this.visit(`/eholdings/packages/${pkg.id}/edit`);
      await PackageEditPage.whenLoaded();
    });

    it('shows the selected # of titles and the total # of titles in the package', () => {
      expect(PackageEditPage.selectionStatus.text).to.equal('5 of 10 titles selected');
    });

    it('shows add all to holdings button', () => {
      expect(PackageEditPage.selectionStatus.buttonText).to.equal('Add all to holdings');
    });

    describe('inspecting the menu', () => {
      beforeEach(async () => {
        await PackageEditPage.dropDown.clickDropDownButton();
      });

      it('has menu item to add all remaining titles from this packages', () => {
        expect(PackageEditPage.dropDownMenu.addToHoldings.text).to.equal('Add all to holdings');
      });

      it('has menu item to remove the entire package from holdings just like a completely selected packages', () => {
        expect(PackageEditPage.dropDownMenu.removeFromHoldings.isVisible).to.equal(true);
      });
    });

    describe('clicking the menu item to add all to holdings', () => {
      beforeEach(async function () {
        await PackageEditPage.whenLoaded();
        await this.server.block();
        await PackageEditPage.selectPackage();
        await this.server.unblock();
      });

      it('reflects that the package has been selected', () => {
        expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
      });

      describe('inspecting the menu', () => {
        beforeEach(async () => {
          await PackageEditPage.dropDown.clickDropDownButton();
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

  describe.skip('clicking the "Add all to holdings" button when the request succeeds inspecting the menu', () => {
    beforeEach(async function () {
      await PackageEditPage.whenLoaded();
      await this.server.block();
      await PackageEditPage.selectPackage();
      await this.server.unblock();
      await PackageEditPage.dropDown.clickDropDownButton();
    });

    it('does not have menu item to add all to holdings', () => {
      expect(PackageEditPage.dropDownMenu.addToHoldings.isPresent).to.equal(false);
    });

    it('has menu item to remove the entire package from holdings', () => {
      expect(PackageEditPage.dropDownMenu.removeFromHoldings.isVisible).to.equal(true);
    });
  });
});

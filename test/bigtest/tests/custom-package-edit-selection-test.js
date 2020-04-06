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
    beforeEach(async function () {
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
      await PackageEditPage.whenLoaded();
    });

    it('displays the correct holdings status (ON)', () => {
      expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking close (navigate back) button', () => {
      beforeEach(() => {
        return PackageEditPage.clickBackButton();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.isPresent).to.be.true;
      });
    });

    describe('deleting the custom package', () => {
      beforeEach(() => {
        return PackageEditPage
          .actionsDropDown.clickDropDownButton()
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
            expect(this.location.search).to.include('?searchType=packages');
          });
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
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
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

    describe('clicking close (navigate back) button', () => {
      beforeEach(() => {
        return PackageEditPage.clickBackButton();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.isPresent).to.equal(true);
      });
    });

    describe('deselecting the package', () => {
      beforeEach(() => {
        return PackageEditPage
          .actionsDropDown.clickDropDownButton()
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
});

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

    it('cannot toggle visibility', () => {
      expect(PackageEditPage.isVisibleTogglePresent).to.equal(false);
    });

    it('cannot select allow kb to add titles', () => {
      expect(PackageEditPage.hasRadioForAllowKbToAddTitles).to.equal(false);
    });

    it('cannot edit coverage', () => {
      expect(PackageEditPage.hasCoverageDatesPresent).to.equal(false);
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

    describe('toggling the selection toggle', () => {
      beforeEach(() => {
        return PackageEditPage.toggleIsSelected();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });

        describe('confirming to continue without saving', () => {
          beforeEach(() => {
            return PackageEditPage.navigationModal.confirmNavigation();
          });

          it('navigates from editing page', () => {
            expect(PackageShowPage.isPresent).to.eq(true);
          });

          it('reflects the desired state of holding status', () => {
            expect(PackageEditPage.isSelected).to.equal(false);
          });
        });
        describe('confirming to keep editing', () => {
          beforeEach(() => {
            return PackageEditPage.navigationModal.cancelNavigation();
          });

          it('remains on the editing page', () => {
            expect(PackageEditPage.isPresent).to.eq(true);
          });
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('displays the new holding status', () => {
          expect(PackageShowPage.isSelected).to.equal(true);
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

    it('can toggle visibility', () => {
      expect(PackageEditPage.isVisibleTogglePresent).to.equal(true);
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

    describe('toggling the selection toggle', () => {
      beforeEach(() => {
        return PackageEditPage.toggleIsSelected();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });

        describe('confirming to continue without saving', () => {
          beforeEach(() => {
            return PackageEditPage.navigationModal.confirmNavigation();
          });

          it('navigates from editing page', () => {
            expect(PackageShowPage.isPresent).to.eq(true);
          });

          it('reflects the desired state of holding status', () => {
            expect(PackageEditPage.isSelected).to.equal(true);
          });
        });
        describe('confirming to keep editing', () => {
          beforeEach(() => {
            return PackageEditPage.navigationModal.cancelNavigation();
          });

          it('remains on the editing page', () => {
            expect(PackageEditPage.isPresent).to.eq(true);
          });
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('shows the modal', () => {
          expect(PackageEditPage.modal.isPresent).to.equal(true);
        });

        it('reflects the desired state of holding status', () => {
          expect(PackageEditPage.isSelected).to.equal(false);
        });

        describe('clicking confirm', () => {
          beforeEach(() => {
            return PackageEditPage.modal.confirmDeselection();
          });

          it('removes the modal', () => {
            expect(PackageEditPage.modal.isPresent).to.equal(false);
          });

          it('reflects the correct holding status', () => {
            expect(PackageEditPage.isSelected).to.equal(false);
          });

          it('goes to the package show page', () => {
            expect(PackageShowPage.$root).to.exist;
          });

          it('reflects the correct holding status', () => {
            expect(PackageEditPage.isSelected).to.equal(false);
          });

          it('shows a success toast message', () => {
            expect(PackageShowPage.toast.successText).to.equal('Package saved.');
          });
        });

        describe('clicking cancel', () => {
          beforeEach(() => {
            return PackageEditPage.modal.cancelDeselection();
          });

          it('removes the modal', () => {
            expect(PackageEditPage.modal.isPresent).to.equal(false);
          });

          it('reflects the correct holding status', () => {
            expect(PackageEditPage.isSelected).to.equal(true);
          });
        });
      });
    });
  });
});

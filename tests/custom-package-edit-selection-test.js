import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';
import PackageEditPage from './pages/package-edit';
import PackageSearchPage from './pages/package-search';

describeApplication('CustomPackageEditSelection', () => {
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
      expect(PackageEditPage.isSelected).to.equal(true);
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

    describe('toggling the selection toggle (OFF)', () => {
      beforeEach(() => {
        return PackageEditPage.toggleIsSelected();
      });

      it('cannot toggle visibility', () => {
        expect(PackageEditPage.isVisibilityFieldPresent).to.equal(false);
      });

      it('cannot edit coverage', () => {
        expect(PackageEditPage.hasCoverageDatesPresent).to.equal(false);
      });

      it('cannot edit package name', () => {
        expect(PackageEditPage.hasReadOnlyNameFieldPresent).to.equal(true);
        expect(PackageEditPage.hasNameFieldPresent).to.equal(false);
      });

      it('cannot edit content type', () => {
        expect(PackageEditPage.hasReadOnlyContentTypeFieldPresent).to.equal(true);
        expect(PackageEditPage.hasContentTypeFieldPresent).to.equal(false);
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

          it('transitions to the package search page', function () {
            expect(this.app.history.location.search).to.include('?searchType=packages');
          });

          describe('searching for package after confirming', () => {
            beforeEach(() => {
              return PackageSearchPage.search('Cool Package');
            });

            it('does not find package', () => {
              expect(PackageSearchPage.noResultsMessage).to.equal('No packages found for "Cool Package".');
            });
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

      describe('toggling the selection toggle ON', () => {
        beforeEach(() => {
          return PackageEditPage.toggleIsSelected();
        });

        it('can toggle visibility', () => {
          expect(PackageEditPage.isVisibilityFieldPresent).to.equal(true);
        });

        it('can edit coverage', () => {
          expect(PackageEditPage.hasCoverageDatesPresent).to.equal(true);
        });

        it('can edit package name', () => {
          expect(PackageEditPage.hasReadOnlyNameFieldPresent).to.equal(false);
          expect(PackageEditPage.hasNameFieldPresent).to.equal(true);
        });

        it('can edit content type', () => {
          expect(PackageEditPage.hasReadOnlyContentTypeFieldPresent).to.equal(false);
          expect(PackageEditPage.hasContentTypeFieldPresent).to.equal(true);
        });
      });
    });
  });
});

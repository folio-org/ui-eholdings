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

    describe('deleting the custom package', () => {
      beforeEach(() => {
        return PackageEditPage
          .dropDown.clickDropDownButton()
          .dropDownMenu.clickRemoveFromHoldings();
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
          expect(PackageEditPage.isSelected).to.equal(true);
        });
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
    });
  });
});

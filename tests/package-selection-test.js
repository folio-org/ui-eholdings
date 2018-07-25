import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageSelection', () => {
  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: false,
      titleCount: 5
    });
  });

  describe('visiting the package details page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/packages/${providerPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('successfully selecting a package title to add to my holdings', () => {
      beforeEach(function () {
        this.server.block();
        return PackageShowPage.selectPackage();
      });

      it('indicates it is working to get to desired state', () => {
        expect(PackageShowPage.isSelecting).to.equal(true);
      });

      describe('when the request succeeds', () => {
        beforeEach(function () {
          return this.server.unblock();
        });

        it('reflect the desired state was set', () => {
          expect(PackageShowPage.isSelected).to.equal(true);
        });

        it('indicates it is no longer working', () => {
          expect(PackageShowPage.isSelecting).to.equal(false);
        });

        it('should show the package titles are all selected', () => {
          expect(PackageShowPage.allTitlesSelected).to.equal(true);
        });

        it('updates the selected title count', () => {
          expect(PackageShowPage.numTitlesSelected).to.equal(`${providerPackage.titleCount}`);
        });
      });

      describe('and deselecting the package', () => {
        beforeEach(function () {
          this.server.unblock();
          // many thanks to elrick for catching the need for
          // the `when` here
          return PackageShowPage
            .when(() => !PackageShowPage.isSelecting)
            .dropDown.clickDropDownButton()
            .dropDownMenu.clickRemoveFromHoldings();
        });

        describe('canceling the deselection', () => {
          beforeEach(() => {
            return PackageShowPage.modal.cancelDeselection();
          });

          it('does not show a loading indicator', () => {
            expect(PackageShowPage.isSelecting).to.equal(false);
          });

          it('remains selected', () => {
            expect(PackageShowPage.isSelected).to.equal(true);
          });
        });

        describe('confirming the deselection', () => {
          beforeEach(function () {
            this.server.block();
            return PackageShowPage.modal.confirmDeselection();
          });

          it('indicates it is working', () => {
            expect(PackageShowPage.isSelecting).to.equal(true);
          });

          describe('when the request succeeds', () => {
            beforeEach(function () {
              this.server.unblock();
            });

            it('reflect the desired state was set', () => {
              expect(PackageShowPage.isSelected).to.equal(false);
            });

            it('indicates it is no longer working', () => {
              expect(PackageShowPage.isSelecting).to.equal(false);
            });

            it('should show the package titles are not all selected', () => {
              expect(PackageShowPage.allTitlesSelected).to.equal(false);
            });

            it('updates the selected title count', () => {
              expect(PackageShowPage.numTitlesSelected).to.equal(`${providerPackage.titleCount}`);
            });

            it('removes custom coverage', () => {
              expect(PackageShowPage.hasCustomCoverage).to.equal(false);
            });
          });
        });
      });
    });

    describe('unsuccessfully selecting a package title to add to my holdings', () => {
      let resolveRequest;
      beforeEach(function () {
        this.server.put('/packages/:packageId', () => {
          return new Promise((resolve) => {
            resolveRequest = resolve;
          });
        });
        return PackageShowPage.selectPackage();
      });

      it('indicates it working to get to desired state', () => {
        expect(PackageShowPage.isSelecting).to.equal(true);
      });

      describe('when the request fails', () => {
        beforeEach(() => {
          resolveRequest({
            errors: [{
              title: 'There was an error'
            }]
          });
        });

        it('reflect the desired state was not set', () => {
          expect(PackageShowPage.isSelected).to.equal(false);
        });

        it('indicates it is no longer working', () => {
          expect(PackageShowPage.isSelecting).to.equal(false);
        });

        it('shows the error as a toast', () => {
          expect(PackageShowPage.toast.errorText).to.equal('There was an error');
        });
      });
    });
  });
});

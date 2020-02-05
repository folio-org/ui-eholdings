import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Response } from '@bigtest/mirage';

import setupApplication from '../helpers/setup-application';
import setupBlockServer from '../helpers/setup-block-server';
import PackageShowPage from '../interactors/package-show';

describe('PackageSelection', () => {
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
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: false,
      titleCount: 5
    });
  });

  describe('visiting the package details page', () => {
    beforeEach(function () {
      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    describe('successfully selecting a package title to add to my holdings', () => {
      beforeEach(async function () {
        await PackageShowPage.whenLoaded();
        this.server.block();
        await PackageShowPage.selectPackage();
      });

      it.skip('indicates it is working to get to desired state', () => {
        expect(PackageShowPage.selectionStatus.isSelecting).to.equal(true);
      });

      describe('when the request succeeds', () => {
        beforeEach(function () {
          this.server.unblock();
        });

        it('reflect the desired state was set', () => {
          expect(PackageShowPage.selectionStatus.isSelected).to.equal(true);
        });

        it('indicates it is no longer working', () => {
          expect(PackageShowPage.selectionStatus.isSelecting).to.equal(false);
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
            .actionsDropDown.clickDropDownButton()
            .dropDownMenu.removeFromHoldings.click();
        });

        describe('canceling the deselection', () => {
          beforeEach(() => {
            return PackageShowPage.modal.cancelDeselection();
          });

          it('does not show a loading indicator', () => {
            expect(PackageShowPage.selectionStatus.isSelecting).to.equal(false);
          });

          it('remains selected', () => {
            expect(PackageShowPage.selectionStatus.isSelected).to.equal(true);
          });
        });

        describe('confirming the deselection', () => {
          beforeEach(function () {
            this.server.block();
            return PackageShowPage.modal.confirmDeselection();
          });


          describe('when the request succeeds', () => {
            beforeEach(function () {
              this.server.unblock();
            });

            it('reflect the desired state was set', () => {
              expect(PackageShowPage.selectionStatus.isSelected).to.equal(false);
            });

            it('indicates it is no longer working', () => {
              expect(PackageShowPage.selectionStatus.isSelecting).to.equal(false);
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
      beforeEach(async function () {
        this.server.put('/packages/:packageId', () => {
          /**
           * Blocking this request did not work solely using
           * the mirage endpoint shorthand. We have to manually
           * build the response to block it with a response code.
           */
          return new Response(500, {}, {
            errors: [{ title: 'There was an error' }]
          });
        });
        await PackageShowPage.whenLoaded();
        this.server.block();
        await PackageShowPage.selectPackage();
      });

      it.skip('indicates it is working to get to desired state', () => {
        expect(PackageShowPage.isSelecting).to.equal(true);
      });

      describe('when the request fails', () => {
        beforeEach(function () {
          this.server.unblock();
        });

        it('reflect the desired state was not set', () => {
          expect(PackageShowPage.selectionStatus.isSelected).to.equal(false);
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

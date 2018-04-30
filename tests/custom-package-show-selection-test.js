import { beforeEach, afterEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

// This test though named custom package show is essentially a Package
// and uses most of the same components as a Package.
// However, there are some nuances between that of a Package and CustomPackage
// so those are excersised in this test.

describeApplication('CustomPackageShowSelection', () => {
  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Cool Custom Package',
      contentType: 'E-Book',
      isCustom: true
    });
  });

  describe('visiting the package details page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/packages/${providerPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('automatically has the custom package in my holdings', () => {
      expect(PackageShowPage.isSelected).to.equal(true);
    });

    describe('deselecting a custom package', () => {
      beforeEach(function () {
        /*
         * The expectations in the convergent `it` blocks
         * get run once every 10ms.  We were seeing test flakiness
         * when a toggle action dispatched and resolved before an
         * expectation had the chance to run.  We sidestep this by
         * temporarily increasing the mirage server's response time
         * to 50ms.
         * TODO: control timing directly with Mirage
         */
        this.server.timing = 50;
        return PackageShowPage.toggleIsSelected();
      });

      afterEach(function () {
        this.server.timing = 0;
      });

      it('reflects the desired state (not selected)', () => {
        expect(PackageShowPage.isSelected).to.equal(false);
      });


      describe('canceling the deselection', () => {
        beforeEach(() => {
          return PackageShowPage.modal.cancelDeselection();
        });

        it('reverts back to the selected state', () => {
          expect(PackageShowPage.isSelected).to.equal(true);
        });
      });


      describe('confirming the deselection', () => {
        beforeEach(function () {
          this.server.timing = 50;
          return PackageShowPage.modal.confirmDeselection();
        });

        afterEach(function () {
          this.server.timing = 0;
        });

        it('reflects the desired state (Unselected)', () => {
          expect(PackageShowPage.isSelected).to.equal(false);
        });

        it('indicates it is working to get to desired state', () => {
          expect(PackageShowPage.isSelecting).to.equal(true);
        });

        it('cannot be interacted with while the request is in flight', () => {
          expect(PackageShowPage.isSelectedToggleDisabled).to.equal(true);
        });

        describe('when the request succeeds', () => {
          it('reflect the desired state was set', () => {
            expect(PackageShowPage.isSelected).to.equal(false);
          });

          it('removes package detail pane', () => {
            expect(PackageShowPage.isPresent).to.equal(false);
          });
        });
      });
    });

    // when you are deleting you are hitting the delete endpoint and not put
    // put is only on updating a custom packge.

    describe('unsuccessfully deselecting a custom package', () => {
      beforeEach(function () {
        this.server.delete('/packages/:packageId', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);

        return PackageShowPage.toggleIsSelected();
      });

      it('reflects the desired state (Unselected)', () => {
        expect(PackageShowPage.isSelected).to.equal(false);
      });

      describe('confirming the deselection', () => {
        beforeEach(() => {
          return PackageShowPage.modal.confirmDeselection();
        });

        it('cannot be interacted with while the request is in flight', () => {
          expect(PackageShowPage.isSelectedToggleDisabled).to.equal(true);
        });

        describe('when the request fails', () => {
          it('reflect the desired state was not set', () => {
            expect(PackageShowPage.isSelected).to.equal(true);
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
});

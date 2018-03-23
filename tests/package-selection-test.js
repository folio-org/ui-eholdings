import { beforeEach, afterEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/bigtest/package-show';

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

      it('reflects the desired state (Selected)', () => {
        expect(PackageShowPage.isSelected).to.equal(true);
      });

      it('indicates it is working to get to desired state', () => {
        expect(PackageShowPage.isSelecting).to.equal(true);
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(PackageShowPage.isSelectedToggleDisabled).to.equal(true);
      });

      describe('when the request succeeds', () => {
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
        beforeEach(() => {
          return PackageShowPage.interaction
            .once(() => !PackageShowPage.isSelectedToggleDisabled)
            .toggleIsSelected();
        });

        it('reflects the desired state (not selected)', () => {
          expect(PackageShowPage.isSelected).to.equal(false);
        });

        it('should show all package titles are not selected', () => {
          expect(PackageShowPage.allTitlesSelected).to.equal(false);
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

            it('is not hideable', () => {
              expect(PackageShowPage.isHiddenTogglePresent).to.equal(false);
            });
          });
        });
      });
    });

    describe('unsuccessfully selecting a package title to add to my holdings', () => {
      beforeEach(function () {
        this.server.put('/packages/:packageId', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);

        this.server.timing = 50;
        return PackageShowPage.toggleIsSelected();
      });

      afterEach(function () {
        this.server.timing = 0;
      });

      it('reflects the desired state (Selected)', () => {
        expect(PackageShowPage.isSelected).to.equal(true);
      });

      it('indicates it working to get to desired state', () => {
        expect(PackageShowPage.isSelecting).to.equal(true);
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(PackageShowPage.isSelectedToggleDisabled).to.equal(true);
      });

      describe('when the request fails', () => {
        it('reflect the desired state was not set', () => {
          expect(PackageShowPage.isSelected).to.equal(false);
        });

        it('indicates it is no longer working', () => {
          expect(PackageShowPage.isSelecting).to.equal(false);
        });

        it.skip('logs an Error somewhere', () => {
          expect(PackageShowPage.flashError).to.match(/unable to select/i);
        });
      });
    });
  });
});

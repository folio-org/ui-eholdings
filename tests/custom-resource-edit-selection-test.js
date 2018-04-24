import { beforeEach, afterEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ResourceEditPage from './pages/resource-edit';
import PackageSearchPage from './pages/package-search';

describeApplication('CustomResourceHoldingSelection', () => {
  let provider,
    providerPackage,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Star Wars Custom Package',
      contentType: 'Online',
      isCustom: true
    });

    let title = this.server.create('title', {
      name: 'Hans Solo Director Cut',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher',
      isTitleCustom: true
    });

    title.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      title,
      url: 'https://www.frontside.io',
      isTitleCustom: true,
      isSelected: true
    });
  });

  describe('visiting the package details page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/resources/${resource.titleId}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('shows the custom package as selected in my holdings', () => {
      expect(ResourceEditPage.isSelected).to.equal(true);
    });

    it('shows save button to be disabled', () => {
      expect(ResourceEditPage.isSaveDisabled).to.equal(true);
    });


    describe('deselecting a custom resource', () => {
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
        return ResourceEditPage.toggleIsSelected();
      });

      afterEach(function () {
        this.server.timing = 0;
      });

      it('reflects the desired state (not selected)', () => {
        expect(ResourceEditPage.isSelected).to.equal(false);
      });

      describe('clicking save button', () => {
        beforeEach(() => {
          return ResourceEditPage.clickSave();
        });

        it('shows the confirmation modal', () => {
          expect(ResourceEditPage.modal.isPresent).to.equal(true);
        });

        describe('confirming the save and continue deselection', () => {
          beforeEach(() => {
            return ResourceEditPage.modal.confirmDeselection();
          });

          it('transition to package search page', () => {
            expect(PackageSearchPage.isPresent).to.equal(true);
          });

          it('has search prefilled with package name', () => {
            expect(PackageSearchPage.searchFieldValue).to.equal('Star Wars Custom Package');
          });

          it('does not have an association to the above package', () => {
            expect(PackageSearchPage.packageTitleList().length).to.equal(0);
          });

          it('has a success Toast notification', () => {
            expect(PackageSearchPage.toast.successText).to.equal('Title removed from package');
          });
        });

        describe('canceling the save and discontinue deselection', () => {
          beforeEach(() => {
            return ResourceEditPage.modal.cancelDeselection();
          });

          it('should not transition to package search page', () => {
            expect(PackageSearchPage.isPresent).to.equal(false);
            expect(ResourceEditPage.isPresent).to.equal(true);
          });

          it('reverts holding status back to original state', () => {
            expect(ResourceEditPage.isSelected).to.equal(true);
          });
        });
      });
    });

    describe('unsuccessfully deselecting a custom resource', () => {
      beforeEach(function () {
        this.server.delete('/resources/:id', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);

        return ResourceEditPage.toggleIsSelected();
      });

      it('reflects the desired state (Unselected)', () => {
        expect(ResourceEditPage.isSelected).to.equal(false);
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return ResourceEditPage.clickSave();
        });

        describe('confirm and continue deselection', () => {
          beforeEach(() => {
            return ResourceEditPage.modal.confirmDeselection();
          });

          it('cannot be interacted with while the request is in flight', () => {
            expect(ResourceEditPage.isSaveDisabled).to.equal(true);
          });

          describe('when the request fails', () => {
            it('indicates it is no longer working', () => {
              expect(ResourceEditPage.isSaveDisabled).to.equal(false);
            });

            it('shows the error as a toast', () => {
              expect(ResourceEditPage.toast.errorText).to.equal('There was an error');
            });
          });
        });
      });
    });
  });
});

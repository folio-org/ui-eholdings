import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from '../helpers/describe-application';
import ResourcePage from '../interactors/resource-show';
import ResourceEditPage from '../interactors/resource-edit';
import PackageSearchPage from '../interactors/package-search';

describeApplication('CustomResourceHoldingSelection', () => {
  let provider,
    title,
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

    title = this.server.create('title', {
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
      expect(ResourceEditPage.isResourceSelected).to.equal('Selected');
    });

    it('shows save button to be disabled', () => {
      expect(ResourceEditPage.isSaveDisabled).to.equal(true);
    });

    describe('deselecting a custom resource', () => {
      beforeEach(() => {
        return ResourcePage
          .dropDown.clickDropDownButton()
          .dropDownMenu.clickRemoveFromHoldings();
      });

      it('shows the confirmation modal', () => {
        expect(ResourceEditPage.modal.isPresent).to.equal(true);
      });

      describe('confirming to continue deselection', () => {
        /**
         * We want to control when this endpoints resolves.
         * Returning a unresolved promise from the endpoint within
         * the beforeEach gives us the control to resolve the request
         * later in tests.
         */

        let resolveRequest;

        beforeEach(function () {
          this.server.delete('/resources/:id', ({ resources }, request) => {
            let matchingResource = resources.find(request.params.id);

            matchingResource.destroy();

            // return {};

            return new Promise((resolve) => {
              resolveRequest = resolve;
            });
          });

          return ResourceEditPage.modal.confirmDeselection();
        });

        it('should keep confirmation modal on screen until requests responds', () => {
          expect(ResourceEditPage.modal.isPresent).to.equal(true);
          resolveRequest();
        });

        it('confirmation button now reads "Removing..."', () => {
          expect(ResourceEditPage.modal.confirmButtonText).to.equal('Removing...');
          resolveRequest();
        });

        it('confirmation button is disabled', () => {
          expect(ResourceEditPage.modal.confirmButtonIsDisabled).to.equal(true);
          resolveRequest();
        });

        describe('when the request resolves', () => {
          beforeEach(() => {
            resolveRequest();
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
            expect(PackageSearchPage.toast.successText).to.equal('Title removed from package.');
          });
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
      });
    });

    describe('unsuccessfully deselecting a custom resource', () => {
      beforeEach(function () {
        this.server.delete('/resources/:id', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);

        return ResourcePage
          .dropDown.clickDropDownButton()
          .dropDownMenu.clickRemoveFromHoldings();
      });

      it('shows a confirmation modal', () => {
        expect(ResourceEditPage.modal.isPresent).to.equal(true);
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
            expect(ResourceEditPage.isSaveDisabled).to.equal(true);
          });

          it('removes the modal', () => {
            expect(ResourceEditPage.modal.isPresent).to.equal(false);
          });

          it('shows the error as a toast', () => {
            expect(ResourceEditPage.toast.errorText).to.equal('There was an error');
          });
        });
      });
    });
  });
});

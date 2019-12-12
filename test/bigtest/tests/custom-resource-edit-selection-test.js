import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceEditPage from '../interactors/resource-edit';
import PackageSearchPage from '../interactors/package-search';

describe('CustomResourceHoldingSelection', () => {
  setupApplication();
  let provider1,
    provider2,
    title1,
    title2,
    providerPackage,
    providerPackageWithOneTitle,
    resource,
    resourceWithOneTitle;

  beforeEach(async function () {
    provider1 = this.server.create('provider', {
      name: 'Cool Provider1'
    });
    provider2 = this.server.create('provider', {
      name: 'Cool Provider2'
    });
    provider1.save();
    provider2.save();
    providerPackage = this.server.create('package', 'withTitles', {
      provider: provider2,
      name: 'Star Wars Custom Package111',
      contentType: 'Online',
      isCustom: true,
      titleCount: 20,
    });
    providerPackage.save();
    providerPackageWithOneTitle = this.server.create('package', 'withTitles', {
      provider: provider1,
      name: 'Star Wars Custom Package',
      contentType: 'Online',
      isCustom: true,
      titleCount: 1,
    });
    providerPackageWithOneTitle.save();
    title1 = this.server.create('title', {
      name: 'Hans Solo Director Cut',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher',
      isTitleCustom: true
    });
    title2 = this.server.create('title', {
      name: 'Hans Solo Director Cut2',
      publicationType: 'Streaming Video2',
      publisherName: 'Amazing Publisher2',
      isTitleCustom: true
    });

    title1.save();
    title2.save();
    resource = this.server.create('resource', {
      package: providerPackage,
      title: title1,
      url: 'https://www.frontside.io',
      isSelected: true
    });
    resourceWithOneTitle = this.server.create('resource', {
      package: providerPackageWithOneTitle,
      title: title2,
      url: 'https://www.frontside.io',
      isSelected: true
    });
    resource.save();
    resourceWithOneTitle.save();
  });


  describe('visiting the package details page', () => {
    beforeEach(async function () {
      await this.visit(`/eholdings/resources/${resource.titleId}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    it('shows the custom package as selected in my holdings', () => {
      expect(ResourceEditPage.isResourceSelected).to.equal('Selected');
    });

    it('shows save button to be disabled', () => {
      expect(ResourceEditPage.isSaveDisabled).to.equal(true);
    });

    describe('deselecting a custom resource', () => {
      describe('when deselecting the last title in the package', () => {
        beforeEach(async function () {
          await ResourceEditPage.whenLoaded();
          await ResourceEditPage.dropDown.clickDropDownButton();
          await ResourceEditPage.dropDownMenu.clickRemoveFromHoldings();
          await ResourceEditPage.when(() => ResourceEditPage.modal.isPresent);
        });

        describe('confirmation modal', () => {
          it('warns that we are deseslecting the last title in the package', () => {
            expect(ResourceEditPage.modal.hasDeselectTitleWarning).to.be.true;
          });
        });
      });

      describe('confirming to continue deselection', () => {
        /**
         * We want to control when this endpoints resolves.
         * Returning a unresolved promise from the endpoint within
         * the beforeEach gives us the control to resolve the request
         * later in tests.
         */

        let resolveRequest;

        beforeEach(async function () {
          await this.server.delete('/resources/:id', ({ resources }, request) => {
            const matchingResource = resources.find(request.params.id);
            matchingResource.destroy();
            // return {};

            return new Promise((resolve) => {
              resolveRequest = resolve;
            });
          });

          await ResourceEditPage.dropDown.clickDropDownButton();
          await ResourceEditPage.dropDownMenu.clickRemoveFromHoldings();
          await ResourceEditPage.when(() => ResourceEditPage.modal.isPresent);
          await ResourceEditPage.modal.confirmDeselection();
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
          beforeEach(async () => {
            await resolveRequest();
          });

          it('transition to package search page', () => {
            expect(PackageSearchPage.isPresent).to.equal(true);
          });

          it('has search prefilled with package name', () => {
            expect(PackageSearchPage.searchFieldValue).to.equal('Star Wars Custom Package111');
          });

          it('has a success Toast notification', () => {
            expect(PackageSearchPage.toast.successText).to.equal('Title removed from package.');
          });
        });
      });

      describe('canceling the save and discontinue deselection', () => {
        beforeEach(async () => {
          await ResourceEditPage.dropDown.clickDropDownButton();
          await ResourceEditPage.dropDownMenu.clickRemoveFromHoldings();
          await ResourceEditPage.when(() => ResourceEditPage.modal.isPresent);
          await ResourceEditPage.modal.cancelDeselection();
        });

        it('should not transition to package search page', () => {
          expect(PackageSearchPage.isPresent).to.equal(false);
          expect(ResourceEditPage.isPresent).to.equal(true);
        });
      });
    });

    describe('unsuccessfully deselecting a custom resource', () => {
      beforeEach(async function () {
        await this.server.delete('/resources/:id', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);

        await ResourceEditPage.dropDown.clickDropDownButton();
        await ResourceEditPage.dropDownMenu.clickRemoveFromHoldings();
        await ResourceEditPage.when(() => ResourceEditPage.modal.isPresent);
      });

      it('shows a confirmation modal', () => {
        expect(ResourceEditPage.modal.isPresent).to.equal(true);
      });

      describe('confirm and continue deselection', () => {
        beforeEach(async () => {
          await ResourceEditPage.modal.confirmDeselection();
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

  describe('visiting the package details page with and deselecting a custom resource with one title shows cofirmation modal', () => {
    beforeEach(async function () {
      await this.visit(`/eholdings/resources/${resourceWithOneTitle.titleId}/edit`);
      await ResourceEditPage.whenLoaded();
      await ResourceEditPage.dropDown.clickDropDownButton();
      await ResourceEditPage.dropDownMenu.clickRemoveFromHoldings();
      await ResourceEditPage.when(() => ResourceEditPage.modal.isPresent);
    });

    it('warns that we are deseslecting a title', () => {
      expect(ResourceEditPage.modal.hasDeselectFinalTitleWarning).to.be.true;
    });
  });
});

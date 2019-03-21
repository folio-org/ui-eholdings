import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourcePage from '../interactors/resource-show';
import ResourceEditPage from '../interactors/resource-edit';
import PackageSearchPage from '../interactors/package-search';

describe('ResourceEditManagedTitleInCustomPackage', () => {
  setupApplication();
  let provider,
    providerPackage,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'The Coolest Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Star Wars Custom Package',
      contentType: 'Online',
      isCustom: true,
      isSelected: true
    });

    const title = this.server.create('title', {
      name: 'Empire Strikes Back Directors Cut',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher',
    });

    title.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      title,
      url: 'https://frontside.io',
      isSelected: true
    });
  });

  describe('visiting the package details page', () => {
    beforeEach(function () {
      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
    });

    it('shows the managed resource as selected in my holdings', () => {
      expect(ResourceEditPage.isResourceSelected).to.equal('Selected');
    });

    it('shows save button to be disabled', () => {
      expect(ResourceEditPage.isSaveDisabled).to.equal(true);
    });


    describe('removing a managed resource', () => {
      beforeEach(() => {
        return ResourcePage
          .dropDown.clickDropDownButton()
          .dropDownMenu.clickRemoveFromHoldings();
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
          expect(PackageSearchPage.toast.successText).to.equal('Title removed from package.');
        });
      });

      describe('canceling the save and discontinue deselection', () => {
        beforeEach(() => {
          return ResourceEditPage.modal.cancelDeselection();
        });

        it('should not transition to title search page', () => {
          expect(PackageSearchPage.isPresent).to.equal(false);
          expect(ResourceEditPage.isPresent).to.equal(true);
        });
      });
    });

    describe('unsuccessfully deselecting a managed resource', () => {
      beforeEach(function () {
        this.server.delete('/resources/:id', {
          errors: [{
            title: 'There was an error.'
          }]
        }, 500);

        return ResourcePage
          .dropDown.clickDropDownButton()
          .dropDownMenu.clickRemoveFromHoldings();
      });

      describe('confirming the deselection', () => {
        beforeEach(() => {
          return ResourceEditPage.modal.confirmDeselection();
        });

        it('shows a toasts with an error message', () => {
          expect(ResourceEditPage.toast.errorText).to.equal('There was an error.');
        });

        it('reflects the desired state was not set)', () => {
          expect(ResourceEditPage.isResourceSelected).to.equal('Selected');
        });
      });
    });
  });
});

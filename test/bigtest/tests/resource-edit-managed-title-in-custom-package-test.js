import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { axe } from '../helpers/setup-application';
import ResourcePage from '../interactors/resource-show';
import ResourceEditPage from '../interactors/resource-edit';
import PackageShowPage from '../interactors/package-show';

describe('ResourceEditManagedTitleInCustomPackage', () => {
  setupApplication();
  let provider,
    providerPackage,
    resource;

  let a11yResults = null;

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
    beforeEach(async function () {
      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
    });

    describe('waiting for axe to run', () => {
      beforeEach(async () => {
        await ResourceEditPage.whenLoaded();
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });
    });

    it('shows the managed resource as selected in my holdings', () => {
      expect(ResourceEditPage.isResourceSelected).to.equal('Selected');
    });

    it('shows save button to be disabled', () => {
      expect(ResourceEditPage.isSaveDisabled).to.equal(true);
    });

    it('custom labels accordion should be present', () => {
      expect(ResourceEditPage.resourceCustomLabelsAccordion.isPresent).to.be.true;
    });

    describe('removing a managed resource', () => {
      beforeEach(async () => {
        await ResourcePage
          .actionsDropDown.clickDropDownButton()
          .dropDownMenu.clickRemoveFromHoldings();

        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });

      it('shows the confirmation modal', () => {
        expect(ResourceEditPage.modal.isPresent).to.equal(true);
      });

      describe('confirming the save and continue deselection', () => {
        beforeEach(() => {
          return ResourceEditPage.modal.confirmDeselection();
        });

        it('transition to package show page', () => {
          expect(PackageShowPage.isPresent).to.equal(true);
        });

        it('has correct package name', () => {
          expect(PackageShowPage.name).to.equal('Star Wars Custom Package');
        });

        it('has a success Toast notification', () => {
          expect(PackageShowPage.toast.successText).to.equal('Title removed from package.');
        });
      });

      describe('canceling the save and discontinue deselection', () => {
        beforeEach(() => {
          return ResourceEditPage.modal.cancelDeselection();
        });

        it('should not transition to title search page', () => {
          expect(PackageShowPage.isPresent).to.equal(false);
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
          .actionsDropDown.clickDropDownButton()
          .dropDownMenu.clickRemoveFromHoldings();
      });

      describe('confirming the deselection', () => {
        beforeEach(async () => {
          await ResourceEditPage.modal.confirmDeselection();
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
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

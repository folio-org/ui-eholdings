import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourcePage from '../interactors/resource-show';
import PackageSearchPage from '../interactors/package-search';

describe('ResourceDeselection', () => {
  setupApplication();
  let provider,
    title,
    providerPackage,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    title = this.server.create('title', {
      publicationType: 'Streaming Video'
    });

    providerPackage = this.server.create('package', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      titleCount: 1,
      selectedCount: 1
    });

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title
    });
  });

  describe('visiting the resource page', () => {
    describe('part of a package with only one selected title', () => {
      beforeEach(async function () {
        await this.visit(`/eholdings/resources/${resource.id}`);
      });

      it('indicates that the resource is selected', () => {
        expect(ResourcePage.isResourceSelected).to.equal('Selected');
      });

      describe('deselecting managed title', () => {
        beforeEach(async () => {
          await ResourcePage.dropDownMenu.clickRemoveFromHoldings();
        });

        describe('deselection modal', () => {
          it('warns the user they are deselecting a title', () => {
            expect(ResourcePage.deselectionModal.hasDeselectTitleWarning).to.be.true;
          });
        });
      });

      describe('deselecting custom title', () => {
        beforeEach(async function () {
          title.isTitleCustom = true;
          await this.visit(`/eholdings/resources/${resource.id}`);
          await ResourcePage.dropDownMenu.clickRemoveFromHoldings();
        });

        describe('deselection modal', () => {
          it('warns the user they are deselecting the final title in the package', () => {
            expect(ResourcePage.deselectionModal.hasDeselectFinalTitleWarning).to.be.true;
          });
        });
      });
    });

    describe('part of a package with several selected titles', () => {
      beforeEach(async function () {
        providerPackage.titleCount = 5;
        providerPackage.selectedCount = 2;

        await this.visit(`/eholdings/resources/${resource.id}`);
      });

      it('indicates that the resource is selected', () => {
        expect(ResourcePage.isResourceSelected).to.equal('Selected');
      });

      describe('deselecting', () => {
        beforeEach(async () => {
          await ResourcePage
            .dropDown.clickDropDownButton()
            .dropDownMenu.clickRemoveFromHoldings();
        });

        it('warns the user they are deselecting', () => {
          expect(ResourcePage.deselectionModal.hasDeselectTitleWarning).to.be.true;
        });

        describe('canceling the deselection', () => {
          beforeEach(async () => {
            await ResourcePage.deselectionModal.cancelDeselection();
          });

          it('reverts back to the selected state', () => {
            expect(ResourcePage.isResourceSelected).to.equal('Selected');
          });
        });

        describe('confirming the deselection', () => {
          beforeEach(async () => {
            await ResourcePage.deselectionModal.confirmDeselection();
          });

          it('remains on Resource Page', () => {
            expect(ResourcePage.isPresent).to.be.true;
          });

          it('set and displayes the selected state', () => {
            expect(ResourcePage.isResourceSelected).to.equal('Not selected');
          });

          describe('when the request succeeds', () => {
            it('shows a success Toast notification', () => {
              expect(PackageSearchPage.toast.successText).to.equal('Title was updated.');
            });
          });
        });
      });
    });
  });
});

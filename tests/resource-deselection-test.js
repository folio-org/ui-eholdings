import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ResourcePage from './pages/resource-show';
import PackageSearchPage from './pages/package-search';

describeApplication('ResourceDeselection', () => {
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
      beforeEach(function () {
        return this.visit(`/eholdings/resources/${resource.id}`, () => {
          expect(ResourcePage.$root).to.exist;
        });
      });

      it('indicates that the resource is selected', () => {
        expect(ResourcePage.isResourceSelected).to.equal('Selected');
      });

      describe('deselecting', () => {
        beforeEach(() => {
          return ResourcePage.dropDownMenu.clickRemoveFromHoldings();
        });

        it('warns the user they are deselecting the final title in the package', () => {
          expect(ResourcePage.deselectionModal.hasDeselectTitleWarning).to.be.true;
        });
      });
    });

    describe('part of a package with several selected titles', () => {
      beforeEach(function () {
        providerPackage.titleCount = 5;
        providerPackage.selectedCount = 2;

        return this.visit(`/eholdings/resources/${resource.id}`, () => {
          expect(ResourcePage.$root).to.exist;
        });
      });

      it('indicates that the resource is selected', () => {
        expect(ResourcePage.isResourceSelected).to.equal('Selected');
      });

      describe('deselecting', () => {
        beforeEach(() => {
          return ResourcePage
            .dropDown.clickDropDownButton()
            .dropDownMenu.clickRemoveFromHoldings();
        });

        it('warns the user they are deselecting', () => {
          expect(ResourcePage.deselectionModal.hasDeselectTitleWarning).to.be.true;
        });

        describe('canceling the deselection', () => {
          beforeEach(() => {
            return ResourcePage.deselectionModal.cancelDeselection();
          });

          it('reverts back to the selected state', () => {
            expect(ResourcePage.isResourceSelected).to.equal('Selected');
          });
        });

        describe('confirming the deselection', () => {
          beforeEach(() => {
            return ResourcePage.deselectionModal.confirmDeselection();
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

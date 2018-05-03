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
        expect(ResourcePage.isSelected).to.equal(true);
      });

      describe('deselecting', () => {
        beforeEach(() => {
          return ResourcePage.toggleIsSelected();
        });

        it('warns the user they are deselecting the final title in the package', () => {
          expect(ResourcePage.deselectionModal.hasDeselectFinalTitleWarning).to.be.true;
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
        expect(ResourcePage.isSelected).to.equal(true);
      });

      describe('deselecting', () => {
        beforeEach(() => {
          return ResourcePage.toggleIsSelected();
        });

        it('warns the user they are deselecting', () => {
          expect(ResourcePage.deselectionModal.hasDeselectTitleWarning).to.be.true;
        });

        it('reflects the desired state (not selected)', () => {
          expect(ResourcePage.isSelected).to.equal(false);
        });

        describe('canceling the deselection', () => {
          beforeEach(() => {
            return ResourcePage.deselectionModal.cancelDeselection();
          });

          it('reverts back to the selected state', () => {
            expect(ResourcePage.isSelected).to.equal(true);
          });
        });

        describe('confirming the deselection', () => {
          beforeEach(() => {
            return ResourcePage.deselectionModal.confirmDeselection();
          });

          it('remains on Resource Page', () => {
            expect(ResourcePage.isPresent).to.be.true;
          });

          describe('when the request succeeds', () => {
            it.skip('shows a success Toast notification', () => {
              expect(PackageSearchPage.toast.successText).to.equal('Title was updated');
            });
          });
        });
      });
    });
  });
});

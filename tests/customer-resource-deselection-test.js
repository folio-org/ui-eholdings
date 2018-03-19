import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ResourcePage from './pages/bigtest/customer-resource-show';

describeApplication('CustomerResourceDeselection', () => {
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

    resource = this.server.create('customer-resource', {
      package: providerPackage,
      isSelected: true,
      title
    });
  });

  describe('visiting the customer resource page', () => {
    describe('part of a package with only one selected title', () => {
      beforeEach(function () {
        return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
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

        return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
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

          it('reflects the desired state (not selected)', () => {
            expect(ResourcePage.isSelected).to.equal(false);
          });

          it('indicates it is working to get to desired state', () => {
            expect(ResourcePage.isSelecting).to.equal(true);
          });

          it('cannot be interacted with while the request is in flight', () => {
            expect(ResourcePage.isSelectedToggleDisabled).to.equal(true);
          });

          describe('when the request succeeds', () => {
            it('reflects the desired state was set', () => {
              expect(ResourcePage.isSelected).to.equal(false);
            });

            it('indicates it is no longer working', () => {
              expect(ResourcePage.isSelecting).to.equal(false);
            });

            it('removes custom embargo', () => {
              expect(ResourcePage.hasCustomEmbargoPeriod).to.equal(false);
            });

            it('is not hidden', () => {
              expect(resource.visibilityData.isHidden).to.equal(false);
              expect(ResourcePage.hasHiddenToggle).to.equal(false);
            });
          });
        });
      });
    });
  });
});

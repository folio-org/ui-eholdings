import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceShowPage from '../interactors/resource-show';
import ResourceEditPage from '../interactors/resource-edit';

describe('ResourceEditDeselection', () => {
  setupApplication();
  let provider,
    title,
    providerPackage,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Neat Provider'
    });

    title = this.server.create('title', {
      publicationType: 'Streaming Video',
    });

    providerPackage = this.server.create('package', {
      provider,
      name: 'Awesome Package',
      contentType: 'EJournal',
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
    beforeEach(function () {
      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('indicates that the resource is selected', () => {
      expect(ResourceEditPage.isResourceSelected).to.equal('Selected');
    });

    describe('deselecting the resource', () => {
      beforeEach(() => {
        return ResourceShowPage
          .actionsDropDown.clickDropDownButton()
          .dropDownMenu.clickRemoveFromHoldings();
      });


      it('should show a confirmation modal', () => {
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
          this.server.put('/resources/:id', ({ resources }, request) => {
            return new Promise((resolve) => {
              resolveRequest = () => {
                const body = JSON.parse(request.requestBody);
                const matchingResource = resources.find(body.data.id);
                const {
                  isSelected,
                } = body.data.attributes;

                matchingResource.update('isSelected', isSelected);

                resolve();
              };
            });
          });

          return ResourceEditPage.modal.confirmDeselection();
        });

        it('should keep confirmation modal on screen until requests responds', () => {
          expect(ResourceEditPage.modal.isPresent).to.equal(true);
          resolveRequest();
        });

        it('confirmation button now reads "removing"', () => {
          expect(ResourceEditPage.modal.confirmButtonText).to.equal('Removing...');
          resolveRequest();
        });

        it('confirmation button is disabled', () => {
          expect(ResourceEditPage.modal.confirmButtonIsDisabled).to.equal(true);
          resolveRequest();
        });

        describe('when request resolves', () => {
          beforeEach(() => {
            resolveRequest();
          });

          it('goes to the resource show page', () => {
            expect(ResourceShowPage.isUrlPresent).to.equal(true);
          });

          it.skip('reflects that the resource is deselected', () => {
            expect(ResourceShowPage.isResourceSelected).to.equal('Not selected');
          });
        });
      });
    });
  });
});

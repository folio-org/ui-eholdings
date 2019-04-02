import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceShowPage from '../interactors/resource-show';
import ResourceEditPage from '../interactors/resource-edit';

window.ResourceEditPage = ResourceEditPage;

describe('ResourceEditSelection', () => {
  setupApplication();
  let provider,
    providerPackage,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      titleCount: 5
    });

    const title = this.server.create('title', {
      publicationType: 'Streaming Video'
    });

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: false,
      title
    });
  });

  describe('visiting the resource edit page with unselected resource', () => {
    beforeEach(function () {
      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('indicates that the resource is not yet selected', () => {
      expect(ResourceEditPage.isResourceSelected).to.equal('Not selected');
    });

    it('displays an add to holdings button', () => {
      expect(ResourceEditPage.addToHoldingsButton).to.equal(true);
    });


    it('should not display the coverage button', () => {
      expect(ResourceEditPage.hasAddCustomCoverageButton).to.be.false;
    });

    it('should not display the custom embargo button', () => {
      expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.false;
    });

    it('should not display the coverage statement textarea', () => {
      expect(ResourceEditPage.hasCoverageStatementArea).to.be.false;
    });

    describe('successfully adding a resource to holdings using button', () => {
      beforeEach(() => {
        return ResourceShowPage.clickAddToHoldingsButton();
      });

      it('reflects the desired state (Selected)', () => {
        expect(ResourceEditPage.isResourceSelected).to.equal('Selected');
      });

      it('remains on the resource edit page', () => {
        expect(ResourceEditPage.hasSaveButon).to.equal(true);
      });
    });

    describe('adding a package title to my holdings but request fails', () => {
      beforeEach(function () {
        this.server.put('/resources/:id', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);
        return ResourceShowPage.clickAddToHoldingsButton();
      });

      describe('when the request fails', () => {
        it('reflects the desired state was set', () => {
          expect(ResourceEditPage.isResourceSelected).to.equal('Not selected');
        });

        it('displays a toast error', () => {
          expect(ResourceShowPage.toast.errorText).to.equal('There was an error');
        });
      });
    });
  });
});

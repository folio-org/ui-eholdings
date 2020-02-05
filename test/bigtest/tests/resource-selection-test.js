import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import setupBlockServer from '../helpers/setup-block-server';
import ResourcePage from '../interactors/resource-show';

describe('ResourceSelection', () => {
  setupApplication();
  let provider,
    providerPackage,
    resource;

  beforeEach(function () {
    setupBlockServer(this.server);
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

  describe('visiting the resource page', () => {
    beforeEach(function () {
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('indicates that the resource is not yet selected', () => {
      expect(ResourcePage.isResourceSelected).to.equal('Not selected');
    });

    window.ResourcePage = ResourcePage;

    describe('successfully selecting a package title to add to my holdings via the drop down', () => {
      beforeEach(async function () {
        await ResourcePage.whenLoaded();
        this.server.block();
        await ResourcePage
          .actionsDropDown.clickDropDownButton()
          .dropDownMenu.clickAddToHoldings();
      });

      it('closes the drop down', () => {
        expect(ResourcePage.actionsDropDown.isExpanded).to.equal('false');
      });

      it('indicates it is working to get to desired state', () => {
        expect(ResourcePage.isLoading).to.equal(true);
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(ResourcePage.isAddToHoldingsButtonDisabled).to.equal(true);
      });

      describe('when the request succeeds', () => {
        beforeEach(function () {
          this.server.unblock();
        });

        it('reflects the desired state was set', () => {
          expect(ResourcePage.isResourceSelected).to.equal('Selected');
        });

        it('indicates it is no longer working', () => {
          expect(ResourcePage.isLoading).to.equal(false);
        });

        it('displays a message indicating there are no coverage customizations', () => {
          expect(ResourcePage.hasNoCustomizationsMessage).to.be.true;
        });
      });
    });

    describe('successfully selecting a package title to add to my holdings via add to holdings button', () => {
      beforeEach(async function () {
        await ResourcePage.whenLoaded();
        this.server.block();
        await ResourcePage.clickAddToHoldingsButton();
      });

      it('indicates it is working to get to desired state', () => {
        expect(ResourcePage.isLoading).to.equal(true);
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(ResourcePage.isAddToHoldingsButtonDisabled).to.be.true;
      });

      describe('when the request succeeds', () => {
        beforeEach(function () {
          this.server.unblock();
        });

        it('reflects the desired state was set', () => {
          expect(ResourcePage.isResourceSelected).to.equal('Selected');
        });

        it('indicates it is no longer working', () => {
          expect(ResourcePage.isLoading).to.equal(false);
        });
      });
    });

    describe('unsuccessfully selecting a package title to add to my holdings', () => {
      beforeEach(async function () {
        this.server.put('/resources/:id', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);
        await ResourcePage.whenLoaded();
        this.server.block();
        await ResourcePage.dropDownMenu.clickAddToHoldings();
      });

      it('indicates it is working to get to desired state', () => {
        expect(ResourcePage.isLoading).to.equal(true);
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(ResourcePage.isAddToHoldingsButtonDisabled).to.equal(true);
      });

      describe('when the request succeeds', () => {
        beforeEach(function () {
          this.server.unblock();
        });

        it('reflects the desired state was not set', () => {
          expect(ResourcePage.isResourceSelected).to.equal('Not selected');
        });

        it('indicates it is no longer working', () => {
          expect(ResourcePage.isLoading).to.equal(false);
        });

        it('displays a toast error', () => {
          expect(ResourcePage.toast.errorText).to.equal('There was an error');
        });
      });
    });
  });
});

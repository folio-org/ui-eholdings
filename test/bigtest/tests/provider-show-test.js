import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ProviderShowPage from '../interactors/provider-show';

describe('ProviderShow', () => {
  setupApplication();
  let provider,
    packages;

  beforeEach(function () {
    provider = this.server.create('provider', 'withPackagesAndTitles', 'withProxy', 'withTokenAndValue', {
      name: 'League of Ordinary Men',
      packagesTotal: 5
    });

    packages = this.server.schema.where('package', { providerId: provider.id }).models;
    packages[0].visibilityData.isHidden = true;
  });

  describe('visiting the provider details page', () => {
    beforeEach(function () {
      this.visit(`/eholdings/providers/${provider.id}`);
    });

    it('displays the provider name in the pane header', () => {
      expect(ProviderShowPage.paneTitle).to.equal('League of Ordinary Men');
    });

    it('displays the provider name', () => {
      expect(ProviderShowPage.name).to.equal('League of Ordinary Men');
    });

    it('displays the collapse all button', () => {
      expect(ProviderShowPage.hasCollapseAllButton).to.be.true;
    });

    it('displays the total number of packages', () => {
      expect(ProviderShowPage.numPackages).to.equal(`${provider.packagesTotal}`);
    });

    it('displays the number of selected packages', () => {
      expect(ProviderShowPage.numPackagesSelected).to.equal(`${provider.packagesSelected}`);
    });

    it('displays the proxy', () => {
      expect(ProviderShowPage.proxy).to.equal(`${provider.proxy.id}`);
    });

    it('displays the token prompt and value', () => {
      expect(ProviderShowPage.providerToken).to.include(`${provider.providerToken.prompt}`);
      expect(ProviderShowPage.providerToken).to.include(`${provider.providerToken.value}`);
    });

    it('displays a list of packages', () => {
      expect(ProviderShowPage.packageList().length).to.equal(packages.length);
    });

    it('displays name of a package in the package list', () => {
      expect(ProviderShowPage.packageList(0).name).to.equal(packages[0].name);
    });

    it('displays number of selected titles for a package', () => {
      expect(ProviderShowPage.packageList(0).numTitlesSelected).to.equal(`${packages[0].selectedCount}`);
    });

    it('displays total number of titles for a package', () => {
      expect(ProviderShowPage.packageList(0).numTitles).to.equal(`${packages[0].titleCount}`);
    });

    it('displays isHidden indicator', () => {
      expect(ProviderShowPage.packageList(0).isPackageHidden).to.equal(packages[0].visibilityData.isHidden);
    });

    it('should display the back (close) button', () => {
      expect(ProviderShowPage.hasBackButton).to.be.true;
    });

    describe('clicking the collapse all button', () => {
      beforeEach(() => {
        return ProviderShowPage.clickCollapseAllButton();
      });

      it('toggles the button text to expand all', () => {
        expect(ProviderShowPage.collapseAllButtonText).to.equal('Expand all');
      });
    });

    describe('clicking the edit button', () => {
      beforeEach(async () => {
        await ProviderShowPage.clickEditButton();
      });

      it('should open Provider Edit Page', function () {
        expect(this.location.pathname).to.equal('/eholdings/providers/1/edit');
      });
    });
  });

  describe('visiting the provider details page with multiple pages of packages', () => {
    beforeEach(function () {
      this.server.loadFixtures();

      this.visit('/eholdings/providers/paged_provider');
    });

    it('should display the first page of related packages', () => {
      expect(ProviderShowPage.packageList(0).name).to.equal('Provider Package 1');
    });

    describe('scrolling down the list of packages', () => {
      beforeEach(() => {
        return ProviderShowPage
          .when(() => ProviderShowPage.packageListHasLoaded)
          .scrollToPackageOffset(26);
      });

      it('should display the next page of related packages', () => {
        // when the list is scrolled, it has a threshold of 5 items. index 4,
        // the 5th item, is the topmost visible item in the list
        expect(ProviderShowPage.packageList(4).name).to.equal('Provider Package 26');
      });
    });
  });

  describe('visiting the provider details page for a large provider', () => {
    beforeEach(function () {
      provider.packagesSelected = 9000;
      provider.packagesTotal = 10000;

      this.visit(`/eholdings/providers/${provider.id}`);
    });

    describe('viewing large providers', () => {
      it('correctly formats the number for selected package count', () => {
        expect(ProviderShowPage.numPackagesSelected).to.equal('9,000');
      });

      it('correctly formats the number for total package count', () => {
        expect(ProviderShowPage.numPackages).to.equal('10,000');
      });
    });
  });

  describe('visiting the provider details page with an inherited proxy', () => {
    beforeEach(function () {
      const proxy = this.server.create('proxy', {
        inherited: true,
        id: 'bigTestJS'
      });
      provider.update('proxy', proxy.toJSON());
      provider.save();

      this.visit(`/eholdings/providers/${provider.id}`);
    });

    it('displays the proxy prepended with Inheritied', () => {
      expect(ProviderShowPage.proxy).to.include('Inherited');
      expect(ProviderShowPage.proxy).to.include(`${provider.proxy.id}`);
    });
  });

  describe('visiting the provider details page with a none proxy', () => {
    beforeEach(function () {
      const proxy = this.server.create('proxy', {
        inherited: false,
        id: '<n>'
      });
      provider.update('proxy', proxy.toJSON());
      provider.save();

      this.visit(`/eholdings/providers/${provider.id}`);
    });

    it('displays the proxy as None', () => {
      expect(ProviderShowPage.proxy).to.equal('None');
    });
  });

  describe('visiting the provider details page with a token without value', () => {
    beforeEach(function () {
      const token = this.server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText: '',
        value: ''
      });
      provider.update('providerToken', token.toJSON());
      provider.save();

      this.visit(`/eholdings/providers/${provider.id}`);
    });

    it('does not display the token', () => {
      expect(ProviderShowPage.isProviderTokenPresent).to.equal(false);
    });

    it('displays a message that no provider token has been set', () => {
      expect(ProviderShowPage.providerTokenMessage).to.equal('No provider token has been set.');
    });
  });

  describe('visiting the provider details page without a token', () => {
    beforeEach(function () {
      provider.update('providerToken', null);
      provider.save();

      this.visit(`/eholdings/providers/${provider.id}`);
    });

    it('does not display the token', () => {
      expect(ProviderShowPage.isProviderTokenPresent).to.equal(false);
    });
  });

  describe('visiting the provider details page without selected packages', () => {
    beforeEach(function () {
      provider.packagesSelected = 0;
      provider.packagesTotal = 1;

      this.visit(`/eholdings/providers/${provider.id}`);
    });

    it('it does not display the tags', () => {
      expect(ProviderShowPage.isTagsPresent).to.equal(false);
    });
  });

  describe('visiting the provider details page with selected packages', () => {
    beforeEach(function () {
      provider.packagesSelected = 10;
      provider.packagesTotal = 10;

      this.visit(`/eholdings/providers/${provider.id}`);
    });

    it('does display the tags', () => {
      expect(ProviderShowPage.isTagsPresent).to.equal(true);
    });
  });

  describe('navigating to provider details page', () => {
    beforeEach(function () {
      this.visit({
        pathname: `/eholdings/providers/${provider.id}`,
        // our internal link component automatically sets the location state
        state: { eholdings: true }
      });
    });

    it('should display the back button in UI', () => {
      expect(ProviderShowPage.hasBackButton).to.be.true;
    });
  });


  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/providers/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit(`/eholdings/providers/${provider.id}`);
    });

    it('has an error', () => {
      expect(ProviderShowPage.hasErrors).to.be.true;
    });

    it('displays the correct error text', () => {
      expect(ProviderShowPage.toast.errorText).to.equal('There was an error');
    });

    it('only has one error', () => {
      expect(ProviderShowPage.toast.errorToastCount).to.equal(1);
      expect(ProviderShowPage.toast.totalToastCount).to.equal(1);
    });

    it('is positioned to the bottom', () => {
      expect(ProviderShowPage.toast.isPositionedBottom).to.be.true;
      expect(ProviderShowPage.toast.isPositionedTop).to.be.false;
    });
  });
});

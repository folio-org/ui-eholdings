import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ProviderShowPage from './pages/provider-show';

describeApplication('ProviderShow', () => {
  let provider,
    packages;

  beforeEach(function () {
    provider = this.server.create('provider', 'withPackagesAndTitles', {
      name: 'League of Ordinary Men',
      packagesTotal: 5
    });

    packages = this.server.schema.where('package', { providerId: provider.id }).models;
    packages[0].visibilityData.isHidden = true;
  });

  describe('visiting the provider details page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/providers/${provider.id}`, () => {
        expect(ProviderShowPage.$root).to.exist;
      });
    });

    it('displays the provider name in the pane header', () => {
      expect(ProviderShowPage.paneTitle).to.equal('League of Ordinary Men');
    });

    it('displays and focuses the provider name', () => {
      expect(ProviderShowPage.name).to.equal('League of Ordinary Men');
      expect(ProviderShowPage.nameHasFocus).to.be.true;
    });

    it('displays the total number of packages', () => {
      expect(ProviderShowPage.numPackages).to.equal(`${provider.packagesTotal}`);
    });

    it('displays the number of selected packages', () => {
      expect(ProviderShowPage.numPackagesSelected).to.equal(`${provider.packagesSelected}`);
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

    it.always('should not display the back button', () => {
      expect(ProviderShowPage.hasBackButton).to.be.false;
    });
  });

  describe('visiting the provider details page with multiple pages of packages', () => {
    beforeEach(function () {
      this.server.loadFixtures();

      return this.visit('/eholdings/providers/paged_provider', () => {
        expect(ProviderShowPage.$root).to.exist;
      });
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

      return this.visit(`/eholdings/providers/${provider.id}`, () => {
        expect(ProviderShowPage.$root).to.exist;
      });
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

  describe('navigating to provider details page', () => {
    beforeEach(function () {
      return this.visit({
        pathname: `/eholdings/providers/${provider.id}`,
        // our internal link component automatically sets the location state
        state: { eholdings: true }
      }, () => {
        expect(ProviderShowPage.$root).to.exist;
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
      });

      return this.visit(`/eholdings/providers/${provider.id}`, () => {
        expect(ProviderShowPage.$root).to.exist;
      });
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

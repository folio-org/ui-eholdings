import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import ProviderShowPage from '../interactors/provider-show';
import ProviderEditPage from '../interactors/provider-edit';

describe('ProviderEdit', () => {
  setupApplication();
  let provider,
    packages;

  beforeEach(function () {
    provider = this.server.create('provider', 'withPackagesAndTitles', 'withProxy', {
      name: 'League of Ordinary Men',
      packagesTotal: 5,
      packagesSelected: 3
    });

    packages = this.server.schema.where('package', { providerId: provider.id }).models;
    packages[0].visibilityData.isHidden = true;
  });

  describe('visiting the provider edit page ', () => {
    beforeEach(function () {
      this.visit(`/eholdings/providers/${provider.id}/edit`);
    });

    it('displays the provider name in the pane header', () => {
      expect(ProviderEditPage.paneTitle).to.equal('League of Ordinary Men');
    });

    it('displays provider name', () => {
      expect(ProviderEditPage.name).to.equal('League of Ordinary Men');
    });

    it('has a select field defaulted with current root proxy', () => {
      expect(ProviderEditPage.proxySelectValue).to.equal('microstates');
    });

    it('disables the save button', () => {
      expect(ProviderEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking close (navigate back) button', () => {
      beforeEach(() => {
        return ProviderEditPage.clickBackButton();
      });

      it('goes to the provider show page', () => {
        expect(ProviderShowPage.isPresent).to.equal(true);
      });
    });

    describe('choosing another root proxy from select', () => {
      beforeEach(() => {
        return ProviderEditPage.chooseRootProxy('Inherited - bigTestJS');
      });

      it('should enable save action button', () => {
        expect(ProviderEditPage.isSaveDisabled).to.eq(false);
      });

      describe('clicking save to update Root Proxy', () => {
        beforeEach(() => {
          return ProviderEditPage.clickSave();
        });

        it('disables the save button', () => {
          expect(ProviderEditPage.isSaveDisabled).to.be.true;
        });

        it('goes to the provider show page', () => {
          expect(ProviderShowPage.isPresent).to.equal(true);
        });

        it('shows newly saved proxy', () => {
          expect(ProviderShowPage.proxy).to.equal('Inherited - bigTestJS');
        });


        it('shows a success toast message', () => {
          expect(ProviderShowPage.toast.successText).to.equal('Provider saved.');
        });
      });

      describe('clicking close (navigate back) button', () => {
        beforeEach(() => {
          return ProviderEditPage.clickBackButton();
        });

        it('shows a navigation confirmation modal', () => {
          expect(ProviderEditPage.navigationModal.$root).to.exist;
        });
      });
    });
  });
  describe('encountering a server error when PUTting a provider', () => {
    beforeEach(function () {
      this.server.put('/providers/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit(`/eholdings/providers/${provider.id}/edit`);
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(() => {
        return ProviderEditPage
          .chooseRootProxy('Inherited - bigTestJS')
          .clickSave();
      });

      it('pops up an error', () => {
        expect(ProviderEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });

  describe('encountering a server error when GETting a provider', () => {
    beforeEach(function () {
      this.server.get('/providers/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit(`/eholdings/providers/${provider.id}/edit`);
    });

    it('dies with dignity', () => {
      expect(ProviderEditPage.hasErrors).to.be.true;
    });
  });

  describe('visiting the provider edit page with no selected packages', () => {
    beforeEach(function () {
      const provider2 = this.server.create('provider', {
        name: 'Sam is awesome',
      });

      this.visit(`/eholdings/providers/${provider2.id}/edit`);
    });

    it('does not display other fields', () => {
      expect(ProviderEditPage.hasProxySelect).to.be.false;
    });

    it('displays add package to holdings message', () => {
      expect(ProviderEditPage.noPackagesSelected).to.equal('Add any package from this provider to holdings to customize provider settings.');
    });
  });
});

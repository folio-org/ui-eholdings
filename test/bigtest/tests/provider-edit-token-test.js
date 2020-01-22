import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import ProviderShowPage from '../interactors/provider-show';
import ProviderEditPage from '../interactors/provider-edit';

describe('ProviderEditToken', () => {
  setupApplication();
  let provider,
    packages,
    longToken;

  beforeEach(function () {
    provider = this.server.create('provider', 'withPackagesAndTitles', 'withTokenAndValue', {
      name: 'League of Ordinary Men',
      packagesTotal: 5,
      packagesSelected: 3
    });

    packages = this.server.schema.where('package', { providerId: provider.id }).models;
    packages[0].visibilityData.isHidden = true;
  });

  describe('visiting the provider edit page with a token and value ', () => {
    beforeEach(function () {
      this.visit(`/eholdings/providers/${provider.id}/edit`);
    });

    it('has token help text', () => {
      expect(ProviderEditPage.providerTokenHelpText).to.equal('Enter your Gale token');
    });

    it('has token prompt', () => {
      expect(ProviderEditPage.providerTokenPrompt).to.equal(provider.providerToken.prompt);
    });

    it('has token value', () => {
      expect(ProviderEditPage.providerTokenValue).to.equal(provider.providerToken.value);
    });

    it('disables the save button', () => {
      expect(ProviderEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking close (navigate back) button', () => {
      beforeEach(() => {
        return ProviderEditPage.clickBackButton();
      });

      it('goes to the provider show page', () => {
        expect(ProviderShowPage.$root).to.exist;
      });
    });

    describe('choosing another value for token', () => {
      beforeEach(() => {
        return ProviderEditPage.inputProviderTokenValue('test-token');
      });

      it('should enable save action button', () => {
        expect(ProviderEditPage.isSaveDisabled).to.eq(false);
      });

      describe('clicking save to update token value', () => {
        beforeEach(() => {
          return ProviderEditPage.clickSave();
        });

        it('disables the save button', () => {
          expect(ProviderEditPage.isSaveDisabled).to.be.true;
        });

        it('goes to the provider show page', () => {
          expect(ProviderShowPage.$root).to.exist;
        });

        it('shows newly saved token', () => {
          expect(ProviderShowPage.providerToken).to.include(`${provider.providerToken.prompt}`);
          expect(ProviderShowPage.providerToken).to.include('test-token');
        });


        it('shows a success toast message', () => {
          expect(ProviderShowPage.toast.successText).to.equal('Provider saved.');
        });
      });
    });
  });

  describe('visiting the provider edit page with a token without a value ', () => {
    beforeEach(function () {
      const token = this.server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText: '<ul><li>Enter your token</li></ul>',
        value: ''
      });
      provider.update('providerToken', token.toJSON());
      provider.save();

      this.visit(`/eholdings/providers/${provider.id}/edit`);
    });

    it('has add token button', () => {
      expect(ProviderEditPage.hasAddProviderTokenBtn).to.be.true;
    });

    describe('clicking add token button', () => {
      beforeEach(() => {
        return ProviderEditPage.clickAddProviderTokenButton();
      });

      it('has token help text', () => {
        expect(ProviderEditPage.providerTokenHelpText).to.equal('Enter your token');
      });

      it('has token prompt', () => {
        expect(ProviderEditPage.providerTokenPrompt).to.equal('/test1/');
      });

      it('has empty token value', () => {
        expect(ProviderEditPage.providerTokenValue).to.equal('');
      });
    });
  });

  describe('visiting the provider edit page without a token', () => {
    beforeEach(function () {
      provider.update('providerToken', null);
      provider.save();

      this.visit(`/eholdings/providers/${provider.id}/edit`);
    });

    it('does not show token help text', () => {
      expect(ProviderEditPage.hasProviderTokenHelpText).to.equal(false);
    });

    it('does not show token prompt', () => {
      expect(ProviderEditPage.hasProviderTokenPrompt).to.equal(false);
    });

    it('does not show token value', () => {
      expect(ProviderEditPage.hasProviderTokenValue).to.equal(false);
    });

    it('does not have add token button', () => {
      expect(ProviderEditPage.hasAddProviderTokenBtn).to.equal(false);
    });
  });

  describe('visiting the provider edit page and setting token to a long value ', () => {
    beforeEach(function () {
      this.visit(`/eholdings/providers/${provider.id}/edit`);
    });

    it('has token value', () => {
      expect(ProviderEditPage.providerTokenValue).to.equal(provider.providerToken.value);
    });

    it('disables the save button', () => {
      expect(ProviderEditPage.isSaveDisabled).to.be.true;
    });

    describe('choosing a lengthy value for token', () => {
      beforeEach(() => {
        longToken = 'a'.repeat(501);
        return ProviderEditPage
          .inputProviderTokenValue(longToken);
      });

      it('highlights the textarea with an error state', () => {
        expect(ProviderEditPage.providerTokenHasError).to.be.true;
      });

      it('displays the correct validation message', () => {
        expect(ProviderEditPage.providerTokenError).to.equal('Tokens must be 500 characters or less.');
      });
    });
  });
});

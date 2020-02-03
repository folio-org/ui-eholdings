import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe('ManagedPackageEditTokens', () => {
  setupApplication();
  let provider,
    providerPackage,
    longToken;

  beforeEach(function () {
    provider = this.server.create('provider', 'withTokenAndValue', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withPackageTokenAndValue', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: true
    });
  });

  describe('visiting the managed package edit page with provider token and value and package token and value', () => {
    beforeEach(function () {
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('has provider token help text', () => {
      expect(PackageEditPage.providerTokenHelpText).to.equal('Enter your Gale token');
    });

    it('has provider token prompt', () => {
      expect(PackageEditPage.providerTokenPrompt).to.equal(provider.providerToken.prompt);
    });

    it('has provider token value', () => {
      expect(PackageEditPage.providerTokenValue).to.equal(provider.providerToken.value);
    });

    it('has package token help text', () => {
      expect(PackageEditPage.packageTokenHelpText).to.equal('Enter your Gale token');
    });

    it('has package token prompt', () => {
      expect(PackageEditPage.packageTokenPrompt).to.equal(providerPackage.packageToken.prompt);
    });

    it('has package token value', () => {
      expect(PackageEditPage.packageTokenValue).to.equal(providerPackage.packageToken.value);
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking close (navigate back) button', () => {
      beforeEach(() => {
        return PackageEditPage.clickBackButton();
      });

      it('goes to the package show page', () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    describe('updating provider token', () => {
      beforeEach(() => {
        return PackageEditPage.inputProviderTokenValue('test-provider-token');
      });

      it('should enable save action button', () => {
        expect(PackageEditPage.isSaveDisabled).to.eq(false);
      });

      describe('clicking save to update provider token value', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('disables the save button', () => {
          expect(PackageEditPage.isSaveDisabled).to.be.true;
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('shows newly saved provider token', () => {
          expect(PackageShowPage.providerToken).to.include(`${provider.providerToken.prompt}`);
          expect(PackageShowPage.providerToken).to.include('test-provider-token');
        });

        it('shows a success toast message', () => {
          expect(PackageShowPage.toast.successText).to.equal('Package saved.');
        });
      });
    });

    describe('updating package token', () => {
      beforeEach(() => {
        return PackageEditPage.inputPackageTokenValue('test-package-token');
      });

      it('should enable save action button', () => {
        expect(PackageEditPage.isSaveDisabled).to.eq(false);
      });

      describe('clicking save to update package token value', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('disables the save button', () => {
          expect(PackageEditPage.isSaveDisabled).to.be.true;
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('shows newly saved package token', () => {
          expect(PackageShowPage.packageToken).to.include(`${providerPackage.packageToken.prompt}`);
          expect(PackageShowPage.packageToken).to.include('test-package-token');
        });

        it('shows a success toast message', () => {
          expect(PackageShowPage.toast.successText).to.equal('Package saved.');
        });
      });
    });

    describe('updating package and provider tokens', () => {
      beforeEach(() => {
        return PackageEditPage.inputProviderTokenValue('test-provider-token')
          .then(() => {
            return PackageEditPage.inputPackageTokenValue('test-package-token');
          });
      });

      it('should enable save action button', () => {
        expect(PackageEditPage.isSaveDisabled).to.eq(false);
      });

      describe('clicking save to update provider and package token value', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('disables the save button', () => {
          expect(PackageEditPage.isSaveDisabled).to.be.true;
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('shows newly saved provider token', () => {
          expect(PackageShowPage.providerToken).to.include(`${provider.providerToken.prompt}`);
          expect(PackageShowPage.providerToken).to.include('test-provider-token');
        });

        it('shows newly saved package token', () => {
          expect(PackageShowPage.packageToken).to.include(`${providerPackage.packageToken.prompt}`);
          expect(PackageShowPage.packageToken).to.include('test-package-token');
        });

        it('shows a success toast message', () => {
          expect(PackageShowPage.toast.successText).to.equal('Package saved.');
        });
      });
    });
  });

  describe('visiting the managed package edit page with a provider token without a value and package token with value', () => {
    beforeEach(function () {
      const token = this.server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText: '<ul><li>Enter your token</li></ul>',
        value: ''
      });
      provider.update('providerToken', token.toJSON());
      provider.save();

      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('has add provider token button', () => {
      expect(PackageEditPage.hasAddProviderTokenBtn).to.be.true;
    });

    it('has package token help text', () => {
      expect(PackageEditPage.packageTokenHelpText).to.equal('Enter your Gale token');
    });

    it('has package token prompt', () => {
      expect(PackageEditPage.packageTokenPrompt).to.equal(providerPackage.packageToken.prompt);
    });

    it('has package token value', () => {
      expect(PackageEditPage.packageTokenValue).to.equal(providerPackage.packageToken.value);
    });

    describe('clicking add provider token button', () => {
      beforeEach(() => {
        return PackageEditPage.clickAddProviderTokenButton();
      });

      it('has provider token help text', () => {
        expect(PackageEditPage.providerTokenHelpText).to.equal('Enter your token');
      });

      it('has provider token prompt', () => {
        expect(PackageEditPage.providerTokenPrompt).to.equal('/test1/');
      });

      it('has empty provider token value', () => {
        expect(PackageEditPage.providerTokenValue).to.equal('');
      });
    });
  });

  describe('visiting the managed package edit page with a provider token with a value and package token without value', () => {
    beforeEach(function () {
      const token = this.server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText: '<ul><li>Enter your token</li></ul>',
        value: ''
      });
      providerPackage.update('packageToken', token.toJSON());
      providerPackage.save();

      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('has add package token button', () => {
      expect(PackageEditPage.hasAddPackageTokenBtn).to.be.true;
    });

    it('has provider token help text', () => {
      expect(PackageEditPage.providerTokenHelpText).to.equal('Enter your Gale token');
    });

    it('has provider token prompt', () => {
      expect(PackageEditPage.providerTokenPrompt).to.equal(provider.providerToken.prompt);
    });

    it('has provider token value', () => {
      expect(PackageEditPage.providerTokenValue).to.equal(provider.providerToken.value);
    });

    describe('clicking add package token button', () => {
      beforeEach(() => {
        return PackageEditPage.clickAddPackageTokenButton();
      });

      it('has package token help text', () => {
        expect(PackageEditPage.packageTokenHelpText).to.equal('Enter your token');
      });

      it('has package token prompt', () => {
        expect(PackageEditPage.packageTokenPrompt).to.equal('/test1/');
      });

      it('has empty package token value', () => {
        expect(PackageEditPage.packageTokenValue).to.equal('');
      });
    });
  });

  describe('visiting the managed package edit page without a provider token', () => {
    beforeEach(function () {
      provider.update('providerToken', null);
      provider.save();

      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('does not show provider token help text', () => {
      expect(PackageEditPage.hasProviderTokenHelpText).to.equal(false);
    });

    it('does not show provider token prompt', () => {
      expect(PackageEditPage.hasProviderTokenPrompt).to.equal(false);
    });

    it('does not show provider token value', () => {
      expect(PackageEditPage.hasProviderTokenValue).to.equal(false);
    });

    it('does not have add provider token button', () => {
      expect(PackageEditPage.hasAddProviderTokenBtn).to.equal(false);
    });

    it('has package token help text', () => {
      expect(PackageEditPage.packageTokenHelpText).to.equal('Enter your Gale token');
    });

    it('has package token prompt', () => {
      expect(PackageEditPage.packageTokenPrompt).to.equal(providerPackage.packageToken.prompt);
    });

    it('has package token value', () => {
      expect(PackageEditPage.packageTokenValue).to.equal(providerPackage.packageToken.value);
    });
  });

  describe('visiting the managed package edit page without a package token', () => {
    beforeEach(function () {
      providerPackage.update('packageToken', null);
      providerPackage.save();

      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('does not show package token help text', () => {
      expect(PackageEditPage.hasPackageTokenHelpText).to.equal(false);
    });

    it('does not show package token prompt', () => {
      expect(PackageEditPage.hasPackageTokenPrompt).to.equal(false);
    });

    it('does not show package token value', () => {
      expect(PackageEditPage.hasPackageTokenValue).to.equal(false);
    });

    it('does not have add package token button', () => {
      expect(PackageEditPage.hasAddPackageTokenBtn).to.equal(false);
    });

    it('has provider token help text', () => {
      expect(PackageEditPage.providerTokenHelpText).to.equal('Enter your Gale token');
    });

    it('has provider token prompt', () => {
      expect(PackageEditPage.providerTokenPrompt).to.equal(provider.providerToken.prompt);
    });

    it('has provider token value', () => {
      expect(PackageEditPage.providerTokenValue).to.equal(provider.providerToken.value);
    });
  });

  describe('visiting the managed package edit page without a provider and package tokens', () => {
    beforeEach(function () {
      provider.update('providerToken', null);
      provider.save();

      providerPackage.update('packageToken', null);
      providerPackage.save();

      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('does not show provider token help text', () => {
      expect(PackageEditPage.hasProviderTokenHelpText).to.equal(false);
    });

    it('does not show provider token prompt', () => {
      expect(PackageEditPage.hasProviderTokenPrompt).to.equal(false);
    });

    it('does not show provider token value', () => {
      expect(PackageEditPage.hasProviderTokenValue).to.equal(false);
    });

    it('does not have add provider token button', () => {
      expect(PackageEditPage.hasAddProviderTokenBtn).to.equal(false);
    });

    it('does not show package token help text', () => {
      expect(PackageEditPage.hasPackageTokenHelpText).to.equal(false);
    });

    it('does not show package token prompt', () => {
      expect(PackageEditPage.hasPackageTokenPrompt).to.equal(false);
    });

    it('does not show package token value', () => {
      expect(PackageEditPage.hasPackageTokenValue).to.equal(false);
    });

    it('does not have add package token button', () => {
      expect(PackageEditPage.hasAddPackageTokenBtn).to.equal(false);
    });
  });

  describe('visiting the managed package edit page and setting provider token to a long value ', () => {
    beforeEach(function () {
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('has provider token value', () => {
      expect(PackageEditPage.providerTokenValue).to.equal(provider.providerToken.value);
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('choosing a lengthy value for provider token', () => {
      beforeEach(() => {
        longToken = 'a'.repeat(501);
        return PackageEditPage
          .inputProviderTokenValue(longToken);
      });

      it('highlights the provider token textarea with an error state', () => {
        expect(PackageEditPage.providerTokenHasError).to.be.true;
      });

      it('displays the correct validation message', () => {
        expect(PackageEditPage.providerTokenError).to.equal('Tokens must be 500 characters or less.');
      });
    });
  });

  describe('visiting the managed package edit page and setting package token to a long value ', () => {
    beforeEach(function () {
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('has package token value', () => {
      expect(PackageEditPage.packageTokenValue).to.equal(providerPackage.packageToken.value);
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('choosing a lengthy value for package token', () => {
      beforeEach(() => {
        longToken = 'a'.repeat(501);
        return PackageEditPage
          .inputPackageTokenValue(longToken);
      });

      it('highlights the package token textarea with an error state', () => {
        expect(PackageEditPage.packageTokenHasError).to.be.true;
      });

      it('displays the correct validation message', () => {
        expect(PackageEditPage.packageTokenError).to.equal('Tokens must be 500 characters or less.');
      });
    });
  });

  describe('visiting the managed package edit page and setting provider and package tokens to long values ', () => {
    beforeEach(function () {
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('has provider token value', () => {
      expect(PackageEditPage.providerTokenValue).to.equal(provider.providerToken.value);
    });

    it('has package token value', () => {
      expect(PackageEditPage.packageTokenValue).to.equal(providerPackage.packageToken.value);
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('choosing lengthy values for provider and package tokens', () => {
      beforeEach(() => {
        longToken = 'a'.repeat(501);
        return PackageEditPage.inputProviderTokenValue(longToken)
          .then(() => {
            return PackageEditPage.inputPackageTokenValue(longToken);
          });
      });

      it('highlights the provider token textarea with an error state', () => {
        expect(PackageEditPage.providerTokenHasError).to.be.true;
      });

      it('displays the correct validation message for provider token', () => {
        expect(PackageEditPage.providerTokenError).to.equal('Tokens must be 500 characters or less.');
      });

      it('highlights the package token textarea with an error state', () => {
        expect(PackageEditPage.packageTokenHasError).to.be.true;
      });

      it('displays the correct validation message for package token', () => {
        expect(PackageEditPage.packageTokenError).to.equal('Tokens must be 500 characters or less.');
      });
    });
  });
});

import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from '../helpers/describe-application';
import ProviderShowPage from '../interactors/provider-show';
import ProviderEditPage from '../interactors/provider-edit';

describeApplication('ProviderEdit', () => {
  let provider,
    packages;

  beforeEach(function () {
    provider = this.server.create('provider', 'withPackagesAndTitles', 'withProxy', {
      name: 'League of Ordinary Men',
      packagesTotal: 5
    });

    packages = this.server.schema.where('package', { providerId: provider.id }).models;
    packages[0].visibilityData.isHidden = true;
  });

  describe('visiting the provider edit page ', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/providers/${provider.id}/edit`, () => {
        expect(ProviderEditPage.$root).to.exist;
      });
    });

    it('displays the provider name in the pane header', () => {
      expect(ProviderEditPage.paneTitle).to.equal('League of Ordinary Men');
    });

    it('displays and focuses the provider name', () => {
      expect(ProviderEditPage.name).to.equal('League of Ordinary Men');
      expect(ProviderEditPage.nameHasFocus).to.be.true;
    });

    it('has a select field defaulted with current root proxy', () => {
      expect(ProviderEditPage.ProxySelectValue).to.equal('microstates');
    });

    it('disables the save button', () => {
      expect(ProviderEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return ProviderEditPage.clickCancel();
      });

      it('goes to the provider show page', () => {
        expect(ProviderShowPage.$root).to.exist;
      });
    });

    describe('choosing another root proxy from select', () => {
      beforeEach(() => {
        return ProviderEditPage.chooseRootProxy('bigTestJS');
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
          expect(ProviderShowPage.$root).to.exist;
        });

        it('shows newly saved proxy', () => {
          expect(ProviderShowPage.proxy).to.equal('bigTestJS');
        });


        it('shows a success toast message', () => {
          expect(ProviderShowPage.toast.successText).to.equal('Provider saved.');
        });
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return ProviderEditPage.clickCancel();
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

      return this.visit(`/eholdings/providers/${provider.id}/edit`, () => {
        expect(ProviderEditPage.$root).to.exist;
      });
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(() => {
        return ProviderEditPage
          .chooseRootProxy('bigTestJS')
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

      return this.visit(`/eholdings/providers/${provider.id}/edit`, () => {
        expect(ProviderEditPage.$root).to.exist;
      });
    });

    it('dies with dignity', () => {
      expect(ProviderEditPage.hasErrors).to.be.true;
    });
  });
});

import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe.skip('ManagedPackageEditProxy', () => {
  setupApplication();
  let provider,
    providerPackage;

  beforeEach(async function () {
    provider = await this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = await this.server.create('package', 'withProxy', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: true
    });
  });

  describe('visiting the package edit page', () => {
    beforeEach(async function () {
      await this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
      await PackageEditPage.whenLoaded();
    });

    it('has a select containing the current proxy value', () => {
      expect(PackageEditPage.proxySelectValue).to.equal('microstates');
    });

    describe('selecting a new proxy value', () => {
      beforeEach(async () => {
        await PackageEditPage.chooseProxy('Inherited - bigTestJS');
      });

      it('enables the save button', () => {
        expect(PackageEditPage.isSaveDisabled).to.be.false;
      });

      it('selected option has changed', () => {
        expect(PackageEditPage.proxySelectValue).to.equal('bigTestJS');
      });

      describe('saving the new proxy value', () => {
        beforeEach(async () => {
          await PackageEditPage.clickSave();
        });

        it('enables the save button', () => {
          expect(PackageEditPage.isSaveDisabled).to.be.true;
        });

        it('goes to the show page', () => {
          expect(PackageShowPage.isPresent).to.be.true;
        });

        it('shows the new proxy value', () => {
          expect(PackageShowPage.proxyValue).to.equal('Inherited - bigTestJS');
        });

        it('shows a success toast', () => {
          expect(PackageShowPage.toast.successText).to.equal('Package saved.');
        });
      });
    });
  });
});

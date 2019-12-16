import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe('CustomPackageEditProxy', async function () {
  setupApplication();

  describe('visiting the package edit page', () => {
    setupApplication({
      scenarios: ['customPackageEditProxy']
    });
    beforeEach(async function () {
      await this.visit('/eholdings/packages/testId/edit');
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

import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from '../helpers/describe-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describeApplication('CustomPackageEditProxy', () => {
  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withProxy', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isCustom: true
    });
  });

  describe('visiting the package edit page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('has a select containing the current proxy value', () => {
      expect(PackageEditPage.proxySelectValue).to.equal('microstates');
    });

    describe('selecting a new proxy value', () => {
      beforeEach(() => {
        return PackageEditPage.chooseProxy('Inherited - bigTestJS');
      });

      it('enables the save button', () => {
        expect(PackageEditPage.isSaveDisabled).to.be.false;
      });

      it('selected option has changed', () => {
        expect(PackageEditPage.proxySelectValue).to.equal('bigTestJS');
      });

      describe('saving the new proxy value', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
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

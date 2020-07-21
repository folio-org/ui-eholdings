import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageEditPage from '../interactors/package-edit';
import PackageShowPage from '../interactors/package-show';

import { accessTypes } from '../../../src/constants';

describe('Custom package edit access types flow', () => {
  setupApplication();

  let testPackage;

  beforeEach(function () {
    testPackage = this.server.create('package', 'withTitles', 'withProvider', {
      isCustom: true,
      isSelected: true,
    });

    this.server.create('access-type', {
      name: 'Trial',
    });
  });

  describe('when access status types were not set in settings', () => {
    beforeEach(function () {
      this.server.get('/access-types', () => []);
      this.visit(`/eholdings/packages/${testPackage.id}/edit`);
    });

    it('should not render access type select', () => {
      expect(PackageEditPage.hasAccessTypeSelect).to.be.false;
    });
  });

  describe('when access status types were set in settings', () => {
    describe('and package does not have access status type selected', () => {
      beforeEach(function () {
        this.visit(`/eholdings/packages/${testPackage.id}/edit`);
      });

      it('should have unselected option as default value', () => {
        expect(PackageEditPage.accessTypeSelectValue).to.equal(accessTypes.ACCESS_TYPE_NONE_ID);
      });

      describe('and an access status type was selected', () => {
        beforeEach(async () => {
          await PackageEditPage.chooseAccessType('Trial');
        });

        it('should enable save action button', () => {
          expect(PackageEditPage.isSaveDisabled).to.be.false;
        });

        describe('and save button was clicked', () => {
          beforeEach(async () => {
            await PackageEditPage.clickSave();
          });

          it('should redirect to the package show page', () => {
            expect(PackageEditPage.$root).to.exist;
          });

          it('should show newly saved access status type', () => {
            expect(PackageShowPage.accessType).to.equal('Trial');
          });

          it('should show a success toast message', () => {
            expect(PackageShowPage.toast.successText).to.equal('Package saved.');
          });
        });
      });
    });
  });
});

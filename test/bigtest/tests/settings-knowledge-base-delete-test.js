import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { axe } from '../helpers/setup-application';
import SettingsCreateKBPage from '../interactors/settings-configuration';

describe('Delete knowledge base flow', () => {
  setupApplication();

  let a11yResults = null;

  describe('when creating a knowledge base', () => {
    beforeEach(async function () {
      this.visit('/settings/eholdings/knowledge-base/new');
      await SettingsCreateKBPage.whenLoaded();
      a11yResults = await axe.run();
    });

    it('should not have any a11y issues', () => {
      expect(a11yResults.violations).to.be.empty;
    });

    it('should not show the delete button', () => {
      expect(SettingsCreateKBPage.deleteButtonIsDisplayed).to.be.false;
    });

    describe('and the knowledge base has been saved', () => {
      beforeEach(async () => {
        await SettingsCreateKBPage.nameField.fillAndBlur('New KB');
        await SettingsCreateKBPage
          .fillCustomerId('totally-bogus-customer-id')
          .fillApiKey('totally-bogus-api-key')
          .chooseRMAPIUrl('https://sandbox.ebsco.io')
          .save();
      });

      it('should display the delete button', () => {
        expect(SettingsCreateKBPage.deleteButtonIsDisplayed).to.be.true;
      });

      describe('and the delete button was clicked', () => {
        beforeEach(async () => {
          await SettingsCreateKBPage.clickDeleteButton();
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });

        it('should display confirmation modal', () => {
          expect(SettingsCreateKBPage.deleteConfirmationModal.isPresent).to.be.true;
        });

        describe('and the cancel button was clicked', () => {
          beforeEach(async () => {
            await SettingsCreateKBPage.deleteConfirmationModal.cancelKBDelete();
          });

          it('should close the modal', () => {
            expect(SettingsCreateKBPage.deleteConfirmationModal.isPresent).to.be.false;
          });
        });

        describe('and the confirmation button was clicked', () => {
          beforeEach(async () => {
            await SettingsCreateKBPage.deleteConfirmationModal.confirmKBDelete();
          });

          it('should close the modal', () => {
            expect(SettingsCreateKBPage.deleteConfirmationModal.isPresent).to.be.false;
          });

          it('should display a notification', () => {
            expect(SettingsCreateKBPage.deleteNotification.isPresent).to.be.true;
          });

          it('should redirect to /settings/eholdings page', function () {
            expect(this.location.pathname).to.equal('/settings/eholdings');
          });
        });
      });
    });
  });
});

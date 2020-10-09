import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { axe } from '../helpers/setup-application';
import SettingsCreateKBPage from '../interactors/settings-configuration';
import wait from '../helpers/wait';

describe('With list of root proxies available to a customer', () => {
  setupApplication();

  let a11yResults = null;

  describe('when click on New button on settings eholdings pane', () => {
    beforeEach(async function () {
      this.visit('/settings/eholdings/knowledge-base/new');
      await wait(1000);
    });

    describe('waiting for axe to run', () => {
      beforeEach(async () => {
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });
    });

    it('should open settings knowledge base create page', () => {
      expect(SettingsCreateKBPage.isPresent).to.be.true;
    });

    it('should view name field', () => {
      expect(SettingsCreateKBPage.nameFieldIsPresent).to.be.true;
    });

    it('should open settings', () => {
      expect(SettingsCreateKBPage.nameField.value).to.be.equal('Knowledge base');
    });

    describe('when fill name field with empty value', () => {
      beforeEach(async () => {
        await SettingsCreateKBPage.nameField.fillAndBlur('');
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });

      it('should show error message', () => {
        expect(SettingsCreateKBPage.nameField.validationMessage).to.equal('Field required. Please revise.');
      });
    });

    describe('when fill mname field with more then 255 character', () => {
      beforeEach(async () => {
        await SettingsCreateKBPage.nameField.fillAndBlur((new Array(256)).fill('a').join('')); // 256 character
      });

      it('should show error message', () => {
        expect(SettingsCreateKBPage.nameField.validationMessage).to.equal('255 character limit has been exceeded. Please revise.');
      });
    });

    describe('when fill all fields', () => {
      beforeEach(async () => {
        await SettingsCreateKBPage.nameField.fillAndBlur('New KB');
        await SettingsCreateKBPage
          .fillCustomerId('totally-bogus-customer-id')
          .fillApiKey('totally-bogus-api-key')
          .chooseRMAPIUrl('https://sandbox.ebsco.io')
          .save();

        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });

      it('should shown toast with successful message', () => {
        expect(SettingsCreateKBPage.toast.successText).to.eq('New KB has been saved');
      });
    });
  });
});

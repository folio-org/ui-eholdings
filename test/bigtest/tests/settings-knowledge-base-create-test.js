import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import SettingsCreateKBPage from '../interactors/settings-configuration';
import wait from '../helpers/wait';

describe('With list of root proxies available to a customer', () => {
  setupApplication();

  describe('when click on New button on settings eholdings pane', () => {
    beforeEach(async function () {
      this.visit('/settings/eholdings/knowledge-base/new');
      await wait(1000);
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
      });

      it('should shown toast with successful message', () => {
        expect(SettingsCreateKBPage.toast.successText).to.eq('New KB has been saved');
      });
    });
  });
});

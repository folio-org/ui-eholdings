import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import SettingsRootProxyPage from '../interactors/settings-root-proxy';
import wait from '../helpers/wait';

describe('With list of root proxies available to a customer', () => {
  setupApplication();

  describe('when visiting the settings root proxy form', () => {
    beforeEach(async function () {
      this.visit('/settings/eholdings/root-proxy');
      await wait(1000);
    });

    it('has a select field defaulted with current root proxy', () => {
      expect(SettingsRootProxyPage.RootProxySelectValue).to.equal('bigTestJS');
    });

    describe('choosing another root proxy from select', () => {
      beforeEach(async () => {
        await SettingsRootProxyPage
          .chooseRootProxy('microstates')
          .save();
      });

      it('should display the updated root proxy', () => {
        expect(SettingsRootProxyPage.RootProxySelectValue).to.eq('microstates');
      });

      it('should disable save button', () => {
        expect(SettingsRootProxyPage.saveButtonDisabled).to.eq(true);
      });

      it('should show a success toast', () => {
        expect(SettingsRootProxyPage.toast.successText).to.eq('Root proxy updated');
      });
    });

    describe('clicking cancel to cancel updating Root Proxy', () => {
      beforeEach(async () => {
        await SettingsRootProxyPage
          .chooseRootProxy('microstates')
          .cancel();
      });

      it('should display the initial root proxy', () => {
        expect(SettingsRootProxyPage.RootProxySelectValue).to.eq('bigTestJS');
      });

      it('should disable save button', () => {
        expect(SettingsRootProxyPage.saveButtonDisabled).to.eq(true);
      });
    });
  });

  describe('encountering a server error when PUTting', () => {
    beforeEach(async function () {
      await this.server.put('/root-proxy', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit('/settings/eholdings/root-proxy');
      await wait(2000);
    });

    describe('updating root-proxy', () => {
      beforeEach(async () => {
        await SettingsRootProxyPage
          .chooseRootProxy('microstates')
          .save();
      });

      it('should show a error toast', () => {
        expect(SettingsRootProxyPage.toast.errorText).to.eq('There was an error');
      });
    });
  });
});

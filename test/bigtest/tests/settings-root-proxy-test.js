import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import SettingsRootProxyPage from '../interactors/settings-root-proxy';

describe.skip('With list of root proxies available to a customer', function () {
  setupApplication();
  // some of the beforeEach blocks seem to timeout in CI
  this.timeout(5000);

  describe('when visiting the settings root proxy form', () => {
    beforeEach(async function () {
      await this.visit('/settings/eholdings/root-proxy');
      await SettingsRootProxyPage.whenLoaded();
    });

    it('has a select field defaulted with current root proxy', () => {
      expect(SettingsRootProxyPage.RootProxySelectValue).to.equal('bigTestJS');
    });

    describe('choosing another root proxy from select', () => {
      beforeEach(async () => {
        await SettingsRootProxyPage.chooseRootProxy('microstates');
        await SettingsRootProxyPage.save();
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
      beforeEach(() => {
        return SettingsRootProxyPage
          .chooseRootProxy('microstates')
          .clickCancel();
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

      await this.visit('/settings/eholdings/root-proxy');
      await SettingsRootProxyPage.whenLoaded(() => SettingsRootProxyPage.isPresent);
    });

    describe('updating root-proxy', () => {
      beforeEach(async () => {
        await SettingsRootProxyPage.chooseRootProxy('microstates').save();
      });

      it('should show a error toast', () => {
        expect(SettingsRootProxyPage.toast.errorText).to.eq('There was an error');
      });
    });
  });
});

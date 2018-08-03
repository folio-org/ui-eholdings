import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from '../helpers/describe-application';
import SettingsRootProxyPage from '../interactors/settings-root-proxy';


describeApplication('With list of root proxies available to a customer', () => {
  describe('when visiting the settings root proxy form', () => {
    beforeEach(function () {
      return this.visit('/settings/eholdings/root-proxy', () => expect(SettingsRootProxyPage.$root).to.exist);
    });

    it('has a select field defaulted with current root proxy', () => {
      expect(SettingsRootProxyPage.RootProxySelectValue).to.equal('bigTestJS');
    });

    describe('choosing another root proxy from select', () => {
      beforeEach(() => {
        return SettingsRootProxyPage.chooseRootProxy('microstates');
      });

      it('should enable save action button', () => {
        expect(SettingsRootProxyPage.saveButtonDisabled).to.eq(false);
      });

      describe('clicking save to update Root Proxy', () => {
        beforeEach(() => {
          return SettingsRootProxyPage.save();
        });

        it('should display the updated root proxy', () => {
          expect(SettingsRootProxyPage.RootProxySelectValue).to.eq('microstates');
        });

        it('should disable save button', () => {
          expect(SettingsRootProxyPage.saveButtonDisabled).to.eq(true);
        });

        it('should show a success toast', () => {
          expect(SettingsRootProxyPage.toast.successText).to.eq('Root Proxy updated');
        });
      });

      describe('clicking cancel to cancel updating Root Proxy', () => {
        beforeEach(() => {
          return SettingsRootProxyPage.clickCancel();
        });

        it('should display the initial root proxy', () => {
          expect(SettingsRootProxyPage.RootProxySelectValue).to.eq('bigTestJS');
        });

        it('should disable save button', () => {
          expect(SettingsRootProxyPage.saveButtonDisabled).to.eq(true);
        });
      });
    });
  });

  describe('encountering a server error when PUTting', () => {
    beforeEach(function () {
      this.server.put('/root-proxy', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit('/settings/eholdings/root-proxy', () => {
        expect(SettingsRootProxyPage.$root).to.exist;
      });
    });

    describe('updating root-proxy', () => {
      beforeEach(() => {
        return SettingsRootProxyPage.chooseRootProxy('microstates').save();
      });

      it('should show a error toast', () => {
        expect(SettingsRootProxyPage.toast.errorText).to.eq('There was an error');
      });
    });
  });
});

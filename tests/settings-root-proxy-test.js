import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import SettingsRootProxyPage from './pages/settings-root-proxy';


describeApplication('With list of root proxies available to a customer', () => {
  describe('when visiting the settings root proxy form', () => {
    beforeEach(function () {
      return this.visit('/settings/eholdings/root-proxy', () => expect(SettingsRootProxyPage.$root).to.exist);
    });

    it('has a select field defaulted with selected root proxy', () => {
      expect(SettingsRootProxyPage.RootProxySelectValue).to.equal('some-selected-value');
    });
  });
});

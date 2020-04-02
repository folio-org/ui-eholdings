import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import Settings from '../interactors/settings';


describe('Settings', () => {
  setupApplication();

  describe('when there are no Knowledge Base Configurations', () => {
    beforeEach(function () {
      // setup empty list of kb configurations
      this.visit('/settings/eholdings');
    });

    it('should display New button', () => {
      expect(Settings.newButtonIsPresent).to.be.true;
    });

    it('should not display any Knowledge Base configurations', () => {
      expect(Settings.configurationNavigationList().length).to.equal(0);
    });
  });
});

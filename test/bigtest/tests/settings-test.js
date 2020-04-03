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
    beforeEach(async function () {
      // setup empty list of kb configurations
      this.visit('/settings/eholdings');
      await Settings.whenLoaded();
    });

    it('should display New button', () => {
      expect(Settings.newButtonIsPresent).to.be.true;
    });

    it('should not display any Knowledge Base configurations', () => {
      expect(Settings.configurationNavigationList().length).to.equal(0);
    });
  });

  describe('when there are Knowledge Base configurations', () => {
    beforeEach(async function () {
      this.visit('/settings/eholdings');
      await Settings.whenLoaded();
    });

    it('should display New button', () => {
      expect(Settings.newButtonIsPresent).to.be.true;
    });

    it('shold display correct number of Knowledge Base configurations', () => {
      expect(Settings.configurationNavigationList().length).to.equal(2);
    });

    it('all settings for unconfigured KB should be disabled', () => {
      Settings.configurationNavigationList()[0].settingsLinks().forEach((link) => {
        expect(link.isDisabled).to.be.true;
      });
    });

    it('all settings for unconfigured KB should be enabled', () => {
      Settings.configurationNavigationList()[1].settingsLinks().forEach((link) => {
        expect(link.isDisabled).to.be.false;
      });
    });

    describe('when clicking on configuration heading', () => {
      beforeEach(async () => {
        await Settings.configurationNavigationList()[0].clickHeading();
      });

      it('should redirect to Knowledge Base configuration page', function() {
        expect(this.location.pathname).to.equal('/settings/eholdings/knowledge-base/Amherst');
      });
    });
  });
});

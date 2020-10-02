import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { axe } from '../helpers/setup-application';
import Settings from '../interactors/settings';

describe('Settings', () => {
  setupApplication();

  let a11yResults = null;

  describe('when there are no Knowledge Base Configurations', () => {
    beforeEach(async function () {
      this.server.get('/kb-credentials/', () => ({
        data: [],
      }));
      this.visit('/settings/eholdings');
      await Settings.whenLoaded();
      a11yResults = await axe.run();
    });

    it('should not have any a11y issues', () => {
      expect(a11yResults.violations).to.be.empty;
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
      a11yResults = await axe.run();
    });

    it('should not have any a11y issues', () => {
      expect(a11yResults.violations).to.be.empty;
    });

    it('should display New button', () => {
      expect(Settings.newButtonIsPresent).to.be.true;
    });

    it('shold display correct number of Knowledge Base configurations', () => {
      expect(Settings.configurationNavigationList().length).to.equal(3);
    });

    it('should display Knowledge Base configurations in alphabetical order', () => {
      const names = Settings.configurationNavigationList().map(kbCredential => kbCredential.name);

      expect(names).to.deep.equal(['Alpha', 'Beta', 'Gamma']);
    });

    describe('when clicking on configuration heading', () => {
      beforeEach(async () => {
        await Settings.configurationNavigationList(0).clickHeading();
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });

      it('should redirect to Knowledge Base configuration page', function () {
        expect(this.location.pathname).to.equal('/settings/eholdings/knowledge-base/2');
      });
    });

    describe('when clicking on new button', () => {
      beforeEach(async () => {
        await Settings.clickNew();
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });

      it('should redirect to Knowledge Base create page', function () {
        expect(this.location.pathname).to.equal('/settings/eholdings/knowledge-base/new');
      });
    });
  });
});

import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { axe } from '../helpers/setup-application';
import ResourceShowPage from '../interactors/resource-show';

describe('ResourceVisibility', () => {
  setupApplication();
  let pkg,
    title,
    resource;

  let a11yResults = null;

  beforeEach(function () {
    pkg = this.server.create('package', 'withProvider');
    title = this.server.create('title');
  });

  describe('visiting the resource show page with a visible resource and is selected', () => {
    beforeEach(async function () {
      resource = this.server.create('resource', {
        package: pkg,
        isSelected: true,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    describe('waiting for axe to run', () => {
      beforeEach(async () => {
        await ResourceShowPage.whenLoaded();
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });
    });

    it('shows titles in package to patrons', () => {
      expect(ResourceShowPage.isResourceVisible).to.be.true;
    });
  });

  describe('visiting the resource show page with a resource that is not selected', () => {
    beforeEach(async function () {
      resource = this.server.create('resource', {
        package: pkg,
        isSelected: false,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    describe('waiting for axe to run', () => {
      beforeEach(async () => {
        await ResourceShowPage.whenLoaded();
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });
    });

    it('does not show titles in package to patrons', () => {
      expect(ResourceShowPage.isResourceHidden).to.be.true;
    });
  });

  describe('visiting the resource show page with a hidden resource and a reason', () => {
    beforeEach(async function () {
      resource = this.server.create('resource', 'isHidden', {
        package: pkg,
        isSelected: true,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    describe('waiting for axe to run', () => {
      beforeEach(async () => {
        await ResourceShowPage.whenLoaded();
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });
    });

    it('does not show titles in package to patrons', () => {
      expect(ResourceShowPage.isResourceHidden).to.be.true;
    });

    it('displays the hidden reason text', () => {
      expect(ResourceShowPage.hiddenReason).to.equal('The content is for mature audiences only.');
    });
  });

  describe('visiting the resource show page with a hidden resource and no reason', () => {
    beforeEach(async function () {
      resource = this.server.create('resource', 'isHiddenWithoutReason', {
        package: pkg,
        isSelected: true,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    describe('waiting for axe to run', () => {
      beforeEach(async () => {
        await ResourceShowPage.whenLoaded();
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });
    });

    it('displays it is not visibile to patrons', () => {
      expect(ResourceShowPage.isResourceHidden).to.be.true;
    });

    it('displays an empty hidden reason text', () => {
      expect(ResourceShowPage.hiddenReason).to.equal('');
    });
  });

  describe('visiting the resource show page and all titles in package are hidden', () => {
    beforeEach(async function () {
      pkg.visibilityData.isHidden = true;
      pkg.visibilityData.reason = 'Hidden by EP';
      resource = this.server.create('resource', 'isHidden', {
        package: pkg,
        title,
        isSelected: true
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    describe('waiting for axe to run', () => {
      beforeEach(async () => {
        await ResourceShowPage.whenLoaded();
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });
    });

    it('displays it is not visibile to patrons', () => {
      expect(ResourceShowPage.isResourceHidden).to.be.true;
    });

    it('displays the hidden reason text', () => {
      expect(ResourceShowPage.hiddenReason).to.equal('All titles in this package are hidden');
    });
  });
});

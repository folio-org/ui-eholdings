import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceShowPage from '../interactors/resource-show';

describe('ResourceVisibility', () => {
  setupApplication();
  let pkg,
    title,
    resource;

  beforeEach(function () {
    pkg = this.server.create('package', 'withProvider');
    title = this.server.create('title');
  });

  describe('visiting the resource show page with a visible resource and is selected', () => {
    beforeEach(function () {
      resource = this.server.create('resource', {
        package: pkg,
        isSelected: true,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('shows titles in package to patrons', () => {
      expect(ResourceShowPage.isResourceVisible).to.be.true;
    });
  });

  describe('visiting the resource show page with a resource that is not selected', () => {
    beforeEach(function () {
      resource = this.server.create('resource', {
        package: pkg,
        isSelected: false,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('does not show titles in package to patrons', () => {
      expect(ResourceShowPage.isResourceHidden).to.be.true;
    });
  });

  describe('visiting the resource show page with a hidden resource and a reason', () => {
    beforeEach(function () {
      resource = this.server.create('resource', 'isHidden', {
        package: pkg,
        isSelected: true,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('does not show titles in package to patrons', () => {
      expect(ResourceShowPage.isResourceHidden).to.be.true;
    });

    it('displays the hidden reason text', () => {
      expect(ResourceShowPage.hiddenReason).to.equal('The content is for mature audiences only.');
    });
  });

  describe('visiting the resource show page with a hidden resource and no reason', () => {
    beforeEach(function () {
      resource = this.server.create('resource', 'isHiddenWithoutReason', {
        package: pkg,
        isSelected: true,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays it is not visibile to patrons', () => {
      expect(ResourceShowPage.isResourceHidden).to.be.true;
    });

    it('displays an empty hidden reason text', () => {
      expect(ResourceShowPage.hiddenReason).to.equal('');
    });
  });

  describe('visiting the resource show page and all titles in package are hidden', () => {
    beforeEach(function () {
      pkg.visibilityData.isHidden = true;
      pkg.visibilityData.reason = 'Hidden by EP';
      resource = this.server.create('resource', 'isHidden', {
        package: pkg,
        title,
        isSelected: true
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays it is not visibile to patrons', () => {
      expect(ResourceShowPage.isResourceHidden).to.be.true;
    });

    it('displays the hidden reason text', () => {
      expect(ResourceShowPage.hiddenReason).to.equal('All titles in this package are hidden');
    });
  });
});

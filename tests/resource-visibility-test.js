import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ResourceShowPage from './pages/resource-show';

describeApplication('ResourceVisibility', () => {
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

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    it('displays Visibility label as Visible to patrons', () => {
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

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    it('displays Visibility label as Not shown to patrons', () => {
      expect(ResourceShowPage.isResourceNotShownLabelPresent).to.be.true;
    });
  });

  describe('visiting the resource show page with a hidden resource and a reason', () => {
    beforeEach(function () {
      resource = this.server.create('resource', 'isHidden', {
        package: pkg,
        isSelected: true,
        title
      });

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    it('displays Visibility label as hidden from patrons', () => {
      expect(ResourceShowPage.isResourceHidden).to.be.true;
    });

    it('maps the hidden reason text', () => {
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

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    it('displays Visibility label as hidden from patrons', () => {
      expect(ResourceShowPage.isResourceHidden).to.be.true;
    });

    it('maps the hidden reason text', () => {
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

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    it('displays Visibility label as hidden from patrons', () => {
      expect(ResourceShowPage.isResourceHidden).to.be.true;
    });

    it('maps the hidden reason text', () => {
      expect(ResourceShowPage.hiddenReason).to.equal('All titles in this package are hidden.');
    });
  });
});

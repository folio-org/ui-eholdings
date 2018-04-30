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

    it('displays an ON visibility toggle (Visible)', () => {
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

    it.always('does not display the visibility toggle', () => {
      expect(ResourceShowPage.visibilitySection).to.not.exist;
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

    it('displays an OFF visibility toggle (Hidden)', () => {
      expect(ResourceShowPage.isResourceVisible).to.be.false;
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

    it('displays an OFF visibility toggle (Hidden)', () => {
      expect(ResourceShowPage.isResourceVisible).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(ResourceShowPage.hiddenReason).to.equal('');
    });
  });

  describe('visiting the resource show page and hiding a resource', () => {
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

    it('displays an ON visibility toggle (Visible)', () => {
      expect(ResourceShowPage.isResourceVisible).to.be.true;
    });

    describe('successfully hiding a resource', () => {
      beforeEach(() => {
        return ResourceShowPage.toggleIsHidden();
      });

      it('reflects the desired state OFF (Hidden)', () => {
        expect(ResourceShowPage.isResourceVisible).to.be.false;
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(ResourceShowPage.isHiddenDisabled).to.be.false;
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state OFF (Hidden)', () => {
          expect(ResourceShowPage.isResourceVisible).to.be.false;
        });

        it('indicates it is no longer pending', () => {
          expect(ResourceShowPage.isHiding).to.be.false;
        });
      });
    });
  });

  describe('visiting the resource show page and showing a hidden resource', () => {
    beforeEach(function () {
      pkg.isSelected = true;
      resource = this.server.create('resource', 'isHiddenWithoutReason', {
        package: pkg,
        isSelected: true,
        title
      });

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    it('displays an OFF visibility toggle (Hidden)', () => {
      expect(ResourceShowPage.isResourceVisible).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(ResourceShowPage.hiddenReason).to.equal('');
    });

    describe('successfully showing a resource', () => {
      beforeEach(() => {
        return ResourceShowPage.toggleIsHidden();
      });

      it('reflects the desired state ON (Visible)', () => {
        expect(ResourceShowPage.isResourceVisible).to.be.true;
      });

      it('cannot be interacted while the request is in flight', () => {
        expect(ResourceShowPage.isHiddenDisabled).to.be.false;
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state ON (Visible)', () => {
          expect(ResourceShowPage.isResourceVisible).to.be.true;
        });

        it('indicates it is no longer pending', () => {
          expect(ResourceShowPage.isHiding).to.be.false;
        });
      });
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

    it('displays an OFF visibility toggle (Hidden)', () => {
      expect(ResourceShowPage.isResourceVisible).to.be.false;
    });

    it('the visibility toggle is disabled', () => {
      expect(ResourceShowPage.isHiddenDisabled).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(ResourceShowPage.hiddenReason).to.equal('All titles in this package are hidden.');
    });
  });
});

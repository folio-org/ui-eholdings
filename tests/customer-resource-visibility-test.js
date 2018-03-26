import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import CustomerResourceShowPage from './pages/customer-resource-show';

describeApplication('CustomerResourceVisibility', () => {
  let pkg,
    title,
    resource;

  beforeEach(function () {
    pkg = this.server.create('package', 'withProvider');
    title = this.server.create('title');
  });

  describe('visiting the customer resource show page with a visible resource and is selected', () => {
    beforeEach(function () {
      resource = this.server.create('customer-resource', {
        package: pkg,
        isSelected: true,
        title
      });

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays an ON visibility toggle (Visible)', () => {
      expect(CustomerResourceShowPage.isVisible).to.be.true;
    });
  });

  describe('visiting the customer resource show page with a resource that is not selected', () => {
    beforeEach(function () {
      resource = this.server.create('customer-resource', {
        package: pkg,
        isSelected: false,
        title
      });

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.always('does not display the visibility toggle', () => {
      expect(CustomerResourceShowPage.visibilitySection).to.not.exist;
    });
  });

  describe('visiting the customer resource show page with a hidden resource and a reason', () => {
    beforeEach(function () {
      resource = this.server.create('customer-resource', 'isHidden', {
        package: pkg,
        isSelected: true,
        title
      });

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays an OFF visibility toggle (Hidden)', () => {
      expect(CustomerResourceShowPage.isVisible).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(CustomerResourceShowPage.hiddenReason).to.equal('The content is for mature audiences only.');
    });
  });

  describe('visiting the customer resource show page with a hidden resource and no reason', () => {
    beforeEach(function () {
      resource = this.server.create('customer-resource', 'isHiddenWithoutReason', {
        package: pkg,
        isSelected: true,
        title
      });

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays an OFF visibility toggle (Hidden)', () => {
      expect(CustomerResourceShowPage.isVisible).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(CustomerResourceShowPage.hiddenReason).to.equal('');
    });
  });

  describe('visiting the customer resource show page and hiding a resource', () => {
    beforeEach(function () {
      resource = this.server.create('customer-resource', {
        package: pkg,
        isSelected: true,
        title
      });

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays an ON visibility toggle (Visible)', () => {
      expect(CustomerResourceShowPage.isVisible).to.be.true;
    });

    describe('successfully hiding a customer resource', () => {
      beforeEach(() => {
        return CustomerResourceShowPage.toggleIsHidden();
      });

      it('reflects the desired state OFF (Hidden)', () => {
        expect(CustomerResourceShowPage.isVisible).to.be.false;
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(CustomerResourceShowPage.isHiddenDisabled).to.be.false;
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state OFF (Hidden)', () => {
          expect(CustomerResourceShowPage.isVisible).to.be.false;
        });

        it('indicates it is no longer pending', () => {
          expect(CustomerResourceShowPage.isHiding).to.be.false;
        });
      });
    });
  });

  describe('visiting the customer resource show page and showing a hidden resource', () => {
    beforeEach(function () {
      pkg.isSelected = true;
      resource = this.server.create('customer-resource', 'isHiddenWithoutReason', {
        package: pkg,
        isSelected: true,
        title
      });

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays an OFF visibility toggle (Hidden)', () => {
      expect(CustomerResourceShowPage.isVisible).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(CustomerResourceShowPage.hiddenReason).to.equal('');
    });

    describe('successfully showing a customer resource', () => {
      beforeEach(() => {
        return CustomerResourceShowPage.toggleIsHidden();
      });

      it('reflects the desired state ON (Visible)', () => {
        expect(CustomerResourceShowPage.isVisible).to.be.true;
      });

      it('cannot be interacted while the request is in flight', () => {
        expect(CustomerResourceShowPage.isHiddenDisabled).to.be.false;
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state ON (Visible)', () => {
          expect(CustomerResourceShowPage.isVisible).to.be.true;
        });

        it('indicates it is no longer pending', () => {
          expect(CustomerResourceShowPage.isHiding).to.be.false;
        });
      });
    });
  });

  describe('visiting the customer resource show page and all titles in package are hidden', () => {
    beforeEach(function () {
      pkg.visibilityData.isHidden = true;
      pkg.visibilityData.reason = 'Hidden by EP';
      resource = this.server.create('customer-resource', 'isHidden', {
        package: pkg,
        title,
        isSelected: true
      });

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays an OFF visibility toggle (Hidden)', () => {
      expect(CustomerResourceShowPage.isVisible).to.be.false;
    });

    it('the visibility toggle is disabled', () => {
      expect(CustomerResourceShowPage.isHiddenDisabled).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(CustomerResourceShowPage.hiddenReason).to.equal('All titles in this package are hidden.');
    });
  });
});

/* global describe, beforeEach, afterEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import CustomerResourceShowPage from './pages/customer-resource-show';

describeApplication('CustomerResourceShowVisibility', () => {
  let pkg,
    title,
    resource;

  beforeEach(function () {
    pkg = this.server.create('package', 'withVendor');
    title = this.server.create('title');
  });

  describe('visiting the customer resource show page with a resource that is not hidden and is selected', () => {
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

    it('displays the visibility toggle as switched to on', () => {
      expect(CustomerResourceShowPage.isHidden).to.be.false;
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

    it('does not display the visibility toggle', () => {
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

      let visibilityData = this.server.create('visibility-data', {
        isHidden: true,
        reason: 'Set by System'
      }).toJSON();

      resource.update('visibilityData', visibilityData);
      resource.save();

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the visibility toggle with as switched to on', () => {
      expect(CustomerResourceShowPage.isHidden).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(CustomerResourceShowPage.hiddenReason).to.equal('Set by System');
    });
  });

  describe('visiting the customer resource show page with a hidden resource and no reason', () => {
    beforeEach(function () {
      resource = this.server.create('customer-resource', 'isHidden', {
        package: pkg,
        isSelected: true,
        title
      });

      let visibilityData = this.server.create('visibility-data', {
        isHidden: true,
        reason: ''
      }).toJSON();

      resource.update('visibilityData', visibilityData);
      resource.save();

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the visibility toggle with as switched to on', () => {
      expect(CustomerResourceShowPage.isHidden).to.be.false;
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

    it('displays the visibility toggle with as switched to on', () => {
      expect(CustomerResourceShowPage.isHidden).to.be.false;
    });

    describe('successfully hiding a customer resource', () => {
      beforeEach(function () {
        this.server.timing = 50;
        return CustomerResourceShowPage.toggleIsHidden();
      });

      afterEach(function () {
        this.server.timing = 0;
      });

      it('reflects the desired state as switched to off', () => {
        expect(CustomerResourceShowPage.isHidden).to.be.true;
      });

      it.skip('cannot be interacted with while the request is in flight', () => {
        expect(CustomerResourceShowPage.isHiddenToggleable).to.be.false;
      });

      describe('when the request succeeds', () => {
        it('reflect the desired state was set as switched to off', () => {
          expect(CustomerResourceShowPage.isHidden).to.be.true;
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
      resource = this.server.create('customer-resource', 'isHidden', {
        package: pkg,
        isSelected: true,
        title
      });

      let visibilityData = this.server.create('visibility-data', {
        isHidden: true,
        reason: ''
      }).toJSON();

      resource.update('visibilityData', visibilityData);
      resource.save();

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the visibility toggle as switched to on', () => {
      expect(CustomerResourceShowPage.isHidden).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(CustomerResourceShowPage.hiddenReason).to.equal('');
    });

    describe('successfully showing a customer resource', () => {
      beforeEach(function () {
        this.server.timing = 50;
        return CustomerResourceShowPage.toggleIsHidden();
      });

      afterEach(function () {
        this.server.timing = 0;
      });

      it('reflects the desired state (Show)', () => {
        expect(CustomerResourceShowPage.isHidden).to.be.false;
      });

      it.skip('cannot be interacted with while the request is in flight', () => {
        expect(CustomerResourceShowPage.isHiddenToggleable).to.be.false;
      });

      describe('when the request succeeds', () => {
        it('reflect the desired state was set (Show)', () => {
          expect(CustomerResourceShowPage.isHidden).to.be.false;
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

      let visibilityData = this.server.create('visibility-data', {
        isHidden: true,
        reason: ''
      }).toJSON();

      resource.update('visibilityData', visibilityData);
      resource.save();

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the visibility toggle with as switched to on', () => {
      expect(CustomerResourceShowPage.isHidden).to.be.false;
    });

    it('the visibility toggle is disabled', () => {
      expect(CustomerResourceShowPage.isHiddenToggleable).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(CustomerResourceShowPage.hiddenReason).to.equal('All titles in this package are hidden.');
    });
  });
});

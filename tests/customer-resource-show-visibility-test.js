/* global describe, beforeEach */
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

  describe('visiting the customer resource show page with a hidden resource', () => {
    beforeEach(function () {
      resource = this.server.create('customer-resource', 'isHidden', {
        package: pkg,
        title
      });

      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the hidden/reason section', () => {
      expect(CustomerResourceShowPage.isHidden).to.be.true;
    });
  });

  describe('visiting the customer resource show page with a resource that is not hidden', () => {
    beforeEach(function () {
      resource = this.server.create('customer-resource', {
        package: pkg,
        title
      });

      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('does not display the hidden/reason section', () => {
      expect(CustomerResourceShowPage.isHidden).to.be.false;
    });
  });
  describe('visiting the customer resource show page with a hidden resource and mapped reason text', () => {
    beforeEach(function () {
      resource = this.server.create('customer-resource', 'isHidden', {
        package: pkg,
        title
      });

      let visibilityData = this.server.create('visibility-data', {
        isHidden: true,
        reason: 'Hidden by EP'
      });
      resource.update('visibilityData', visibilityData);
      resource.save();
      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the hidden/reason section', () => {
      expect(CustomerResourceShowPage.isHidden).to.be.true;
    });
    it('maps the hidden reason text', () => {
      expect(CustomerResourceShowPage.hiddenReason).to.equal('Set by System');
    });
  });
  describe('visiting the customer resource show page with a hidden resource and reason text is not mapped', () => {
    beforeEach(function () {
      resource = this.server.create('customer-resource', 'isHidden', {
        package: pkg,
        title
      });

      let visibilityData = this.server.create('visibility-data', {
        isHidden: true,
        reason: 'Not Mapped Reason Text'
      });
      resource.update('visibilityData', visibilityData);
      resource.save();
      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the hidden/reason section', () => {
      expect(CustomerResourceShowPage.isHidden).to.be.true;
    });
    it('maps the hidden reason text', () => {
      expect(CustomerResourceShowPage.hiddenReason).to.equal('Not Mapped Reason Text');
    });
  });
});

/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import CustomerResourceShowPage from './pages/customer-resource-show';

describeApplication('CustomerResourceShowEmbargos', function() {
  let pkg, title, resource;

  beforeEach(function() {
    pkg = this.server.create('package', 'withVendor');
    title = this.server.create('title');
    resource = this.server.create('customer-resource', {
      package: pkg,
      title
    });
  });

  describe("visiting the customer resource show page with custom and managed embargos", function() {
    beforeEach(function() {
      resource.managedEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Months',
        embargoValue: 6
      });

      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Weeks',
        embargoValue: 9
      });

      resource.save();

      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the managed embargo section', function() {
      expect(CustomerResourceShowPage.managedEmbargoPeriod).to.equal('6 Months');
    });

    it('displays the custom embargo section', function() {
      expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('9 Weeks');
    });
  });

  describe("visiting the customer resource show page without any embargos", function() {
    beforeEach(function() {
      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.still('does not display the managed embargo section', function() {
      expect(CustomerResourceShowPage.managedEmbargoPeriod).to.equal('');
    });

    it.still('does not display the custom embargo section', function() {
      expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('');
    });
  });
});

/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import CustomerResourceShowPage from './pages/customer-resource-show';

describeApplication('CustomerResourceShowManagedCoverage', () => {
  let pkg,
    title,
    resource;

  beforeEach(function () {
    pkg = this.server.create('package', 'withVendor');
    title = this.server.create('title');
    resource = this.server.create('customer-resource', {
      package: pkg,
      title
    });
  });

  describe('visiting the customer resource show page with managed coverage undefined', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('does not display the managed coverage section', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('');
    });
  });

  describe('visiting the customer resource show page with single managed coverage', () => {
    beforeEach(function () {
      resource.managedCoverageList = this.server.createList('managed-coverage', 1,
        {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
        });
      resource.save();

      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('does display the managed coverage section for single date', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('7/16/1969 - 12/19/1972');
    });
  });
});

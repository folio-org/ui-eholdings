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

  describe('visiting the customer resource page with managed coverage undefined', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('does not display the managed coverage section', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('');
    });
  });

  describe('visiting the customer resource page with single managed coverage', () => {
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

    it('displays the managed coverage section for single date', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('7/16/1969 - 12/19/1972');
    });
  });
  describe('visiting the customer resource page with single managed coverage (endCoverage null)', () => {
    beforeEach(function () {
      resource.managedCoverageList = this.server.createList('managed-coverage', 1,
        {
          beginCoverage: '1969-07-16',
          endCoverage: null
        });
      resource.save();

      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('display the managed coverage section for single date (begin date and no end date)', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('7/16/1969 - Present');
    });
  });

  describe('visiting the customer resource page with single managed coverage (endCoverage empty)', () => {
    beforeEach(function () {
      resource.managedCoverageList = this.server.createList('managed-coverage', 1,
        {
          beginCoverage: '1969-07-16',
          endCoverage: ''
        });
      resource.save();

      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('display the managed coverage section for single date (begin date and no end date)', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('7/16/1969 - Present');
    });
  });

  describe('visiting the customer resource page with incorrectly formed coverage dates', () => {
    beforeEach(function () {
      resource.managedCoverageList = this.server.createList('managed-coverage', 1,
        {
          beginCoverage: '1969-07',
          endCoverage: '1969-07-16'
        });
      resource.save();

      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('does not display coverage dates', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('');
    });
  });
  describe('visiting the customer resource page with multiple managed coverage dates', () => {
    beforeEach(function () {
      resource.managedCoverageList = this.server.createList('managed-coverage', 2);
      resource.managedCoverageList = [
        this.server.create('managed-coverage', { beginCoverage: '1969-07-16', endCoverage: '1972-12-19' }),
        this.server.create('managed-coverage', { beginCoverage: '1974-01-01', endCoverage: '1979-12-19' }),
      ];
      resource.save();

      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays date ranges comma separated and ordered by most recent coverage to least recent coverage', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('1/1/1974 - 12/19/1979, 7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the customer resource page with managed coverage and year only publication type', () => {
    beforeEach(function () {
      title.pubType = 'Audiobook';
      title.save;

      resource.managedCoverageList = this.server.createList('managed-coverage', 1,
        {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
        }
      );
      resource.save();

      return this.visit(`/eholdings/vendors/${pkg.vendor.id}/packages/${pkg.id}/titles/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });
    // it('displays dates with YYYY format', () => {
    //  expect(CustomerResourceShowPage.managedCoverageList).to.equal('1969 - 1972');
    // });
  });
});

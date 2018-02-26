/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import CustomerResourceShowPage from './pages/customer-resource-show';

describeApplication('CustomerResourceManagedCoverage', () => {
  let pkg,
    title,
    resource;

  beforeEach(function () {
    pkg = this.server.create('package', 'withProvider');

    title = this.server.create('title', {
      publicationType: 'Journal'
    });

    resource = this.server.create('customer-resource', {
      package: pkg,
      title
    });
  });

  describe('visiting the customer resource page with managed coverage undefined', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.still('does not display the managed coverage section', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('');
    });
  });

  describe('visiting the customer resource page with empty (0 length) managed coverage array', () => {
    beforeEach(function () {
      resource.managedCoverages = this.server.createList('managed-coverage', 0).map(m => m.toJSON());
      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.still('does not display the managed coverage section', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('');
    });
  });

  describe('visiting the customer resource page with single managed coverage', () => {
    beforeEach(function () {
      resource.managedCoverages = this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      }).map(m => m.toJSON());

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the managed coverage section for single date', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the customer resource page with single managed coverage (endCoverage null)', () => {
    beforeEach(function () {
      resource.managedCoverages = this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-07-16',
        endCoverage: null
      }).map(m => m.toJSON());

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('display the managed coverage section for single date (begin date and no end date)', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('7/16/1969 - Present');
    });
  });

  describe('visiting the customer resource page with single managed coverage (endCoverage empty)', () => {
    beforeEach(function () {
      resource.managedCoverages = this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-07-16',
        endCoverage: ''
      }).map(m => m.toJSON());

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('display the managed coverage section for single date (begin date and no end date)', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('7/16/1969 - Present');
    });
  });

  describe('visiting the customer resource page with single managed coverage (beginCoverage empty)', () => {
    beforeEach(function () {
      resource.managedCoverages = this.server.createList('managed-coverage', 1, {
        beginCoverage: '',
        endCoverage: '1969-07-16'
      }).map(m => m.toJSON());

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('display the managed coverage section for single date (end date only)', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('7/16/1969');
    });
  });

  describe('visiting the customer resource page with multiple managed coverage dates', () => {
    beforeEach(function () {
      resource.managedCoverages = [
        this.server.create('managed-coverage', { beginCoverage: '1969-07-16', endCoverage: '1972-12-19' }),
        this.server.create('managed-coverage', { beginCoverage: '1974-01-01', endCoverage: '1979-12-19' }),
      ].map(m => m.toJSON());

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays date ranges comma separated and ordered by most recent coverage to least recent coverage', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('1/1/1974 - 12/19/1979, 7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the customer resource page with managed coverage and year only publication type, multiple years', () => {
    beforeEach(function () {
      title.publicationType = 'Audiobook';
      title.save();

      resource.managedCoverages = this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      }).map(m => m.toJSON());

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays dates with YYYY format', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('1969 - 1972');
    });
  });

  describe('visiting the customer resource page with managed coverage and year only publication type single year', () => {
    beforeEach(function () {
      title.publicationType = 'Audiobook';
      title.save();

      resource.managedCoverages = this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-01-01',
        endCoverage: '1969-05-01'
      }).map(m => m.toJSON());

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays dates with YYYY format', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('1969');
    });
  });

  describe('visiting the customer resource page with managed coverage and year only publication type missing end year', () => {
    beforeEach(function () {
      title.publicationType = 'Audiobook';
      title.save();

      resource.managedCoverages = this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-01-01',
        endCoverage: ''
      }).map(m => m.toJSON());

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays dates with YYYY format', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('1969');
    });
  });

  describe('visiting the customer resource page with managed coverage and year only publication type missing begin year', () => {
    beforeEach(function () {
      title.publicationType = 'Audiobook';
      title.save();

      resource.managedCoverages = this.server.createList('managed-coverage', 1, {
        beginCoverage: '',
        endCoverage: '1969-01-01'
      }).map(m => m.toJSON());

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays dates with YYYY format', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('1969');
    });
  });

  describe('visiting the customer resource page with managed coverage and year only publication type missing begin and end year', () => {
    beforeEach(function () {
      title.publicationType = 'Audiobook';
      title.save();

      resource.managedCoverageList = this.server.createList('managed-coverage', 1, {
        beginCoverage: '',
        endCoverage: ''
      }).map(m => m.toJSON());

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.still('does not display managed coverage list', () => {
      expect(CustomerResourceShowPage.managedCoverageList).to.equal('');
    });
  });
});

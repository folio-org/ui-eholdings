import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceShowPage from '../interactors/resource-show';

describe.skip('ResourceManagedCoverage', function () {
  setupApplication();
  // some of the beforeEach blocks seem to timeout in CI
  this.timeout(5000);
  let pkg,
    title,
    resource;

  beforeEach(function () {
    pkg = this.server.create('package', 'withProvider');

    title = this.server.create('title', {
      publicationType: 'Journal'
    });

    resource = this.server.create('resource', {
      package: pkg,
      title,
      isSelected: true
    });
  });

  describe('visiting the resource page with managed coverage undefined', () => {
    beforeEach(async function () {
      this.visit(`/eholdings/resources/${resource.id}`);
      await ResourceShowPage.whenLoaded();
    });

    it.always('does not display the managed coverage section', () => {
      expect(ResourceShowPage.hasManagedCoverageList).to.be.false;
    });
  });

  describe('visiting the resource page with empty (0 length) managed coverage array', () => {
    beforeEach(async function () {
      resource.managedCoverages = await this.server.createList('managed-coverage', 0).map(m => m.toJSON());
      await resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
      await ResourceShowPage.whenLoaded();
    });

    it.always('does not display the managed coverage section', () => {
      expect(ResourceShowPage.hasManagedCoverageList).to.be.false;
    });
  });

  describe('visiting the resource page with single managed coverage', () => {
    beforeEach(async function () {
      resource.managedCoverages = await this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      }).map(m => m.toJSON());

      await resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
      await ResourceShowPage.whenLoaded();
    });

    it('displays the managed coverage section for single date', () => {
      expect(ResourceShowPage.managedCoverageList).to.equal('7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the resource page with single managed coverage (endCoverage empty)', () => {
    beforeEach(async function () {
      resource.managedCoverages = await this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-07-16',
        endCoverage: ''
      }).map(m => m.toJSON());

      await resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
      await ResourceShowPage.whenLoaded();
    });

    it('display the managed coverage section for single date (begin date and no end date)', () => {
      expect(ResourceShowPage.managedCoverageList).to.equal('7/16/1969 - Present');
    });
  });

  describe('visiting the resource page with single managed coverage (beginCoverage empty)', () => {
    beforeEach(async function () {
      resource.managedCoverages = await this.server.createList('managed-coverage', 1, {
        beginCoverage: '',
        endCoverage: '1969-07-16'
      }).map(m => m.toJSON());

      await resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
      await ResourceShowPage.whenLoaded();
    });

    it('display the managed coverage section for single date (end date only)', () => {
      expect(ResourceShowPage.managedCoverageList).to.equal('7/16/1969');
    });
  });

  describe('visiting the resource page with multiple managed coverage dates', () => {
    beforeEach(async function () {
      resource.managedCoverages = [
        await this.server.create('managed-coverage', { beginCoverage: '1969-07-16', endCoverage: '1972-12-19' }),
        await this.server.create('managed-coverage', { beginCoverage: '1974-01-01', endCoverage: '1979-12-19' }),
      ].map(m => m.toJSON());

      await resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
      await ResourceShowPage.whenLoaded();
    });

    it('displays date ranges comma separated and ordered by most recent coverage to least recent coverage', () => {
      expect(ResourceShowPage.managedCoverageList).to.equal('1/1/1974 - 12/19/1979, 7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the resource page with managed coverage and year only publication type, multiple years', () => {
    beforeEach(async function () {
      title.publicationType = 'Audiobook';
      await title.save();

      resource.managedCoverages = await this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      }).map(m => m.toJSON());

      await resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
      await ResourceShowPage.whenLoaded();
    });

    it('displays dates with YYYY format', () => {
      expect(ResourceShowPage.managedCoverageList).to.equal('1969 - 1972');
    });
  });

  describe('visiting the resource page with managed coverage and year only publication type single year', () => {
    beforeEach(async function () {
      title.publicationType = 'Audiobook';
      await title.save();

      resource.managedCoverages = await this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-01-01',
        endCoverage: '1969-05-01'
      }).map(m => m.toJSON());

      await resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
      await ResourceShowPage.whenLoaded();
    });

    it('displays dates with YYYY format', () => {
      expect(ResourceShowPage.managedCoverageList).to.equal('1969');
    });
  });

  describe('visiting the resource page with managed coverage and year only publication type missing end year', () => {
    beforeEach(async function () {
      title.publicationType = 'Audiobook';
      await title.save();

      resource.managedCoverages = await this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-01-01',
        endCoverage: ''
      }).map(m => m.toJSON());

      await resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
      await ResourceShowPage.whenLoaded();
    });

    it('displays dates with YYYY format', () => {
      expect(ResourceShowPage.managedCoverageList).to.equal('1969');
    });
  });

  describe('visiting the resource page with managed coverage and year only publication type missing begin year', () => {
    beforeEach(async function () {
      title.publicationType = 'Audiobook';
      await title.save();

      resource.managedCoverages = await this.server.createList('managed-coverage', 1, {
        beginCoverage: '',
        endCoverage: '1969-01-01'
      }).map(m => m.toJSON());

      await resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
      await ResourceShowPage.whenLoaded();
    });

    it('displays dates with YYYY format', () => {
      expect(ResourceShowPage.managedCoverageList).to.equal('1969');
    });
  });

  describe('visiting the resource page with managed coverage and year only publication type missing begin and end year', () => {
    beforeEach(async function () {
      title.publicationType = 'Audiobook';
      await title.save();

      resource.managedCoverageList = await this.server.createList('managed-coverage', 1, {
        beginCoverage: '',
        endCoverage: ''
      }).map(m => m.toJSON());

      await resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
      await ResourceShowPage.whenLoaded();
    });

    it.always('does not display managed coverage list', () => {
      expect(ResourceShowPage.hasManagedCoverageList).to.be.false;
    });
  });
});

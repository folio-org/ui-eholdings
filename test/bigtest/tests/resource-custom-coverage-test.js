import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import ResourcePage from '../interactors/resource-show';

describe.skip('ResourceCustomCoverage', function () {
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
      title
    });
    resource.isSelected = true;

    resource.save();
  });

  describe('visiting an unselected resource show page', () => {
    beforeEach(async function () {
      resource.isSelected = false;
      resource.save();

      await this.visit(`/eholdings/resources/${resource.id}`);
      await ResourcePage.whenLoaded();
    });

    it('displays message that resource needs to be selected', () => {
      expect(ResourcePage.isNotSelectedCoverageMessagePresent).to.be.true;
    });

    it('does not display custom coverage dates', () => {
      expect(ResourcePage.hasCustomCoverageList).to.be.false;
    });
  });

  describe('visiting a selected resource show page with custom coverage', () => {
    beforeEach(async function () {
      const customCoverages = [
        await this.server.create('custom-coverage', {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
        })
      ];
      await resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}`);
      await ResourcePage.whenLoaded();
    });

    it('displays the date ranges', () => {
      expect(ResourcePage.customCoverageList).to.equal('7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the resource show page with empty (0 length) custom coverage array', () => {
    beforeEach(async function () {
      resource.customCoverages = await this.server.createList('custom-coverage', 0).map(m => m.toJSON());
      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}`);
      await ResourcePage.whenLoaded();
    });

    it.always('does not display the custom coverage section', () => {
      expect(ResourcePage.hasCustomCoverageList).to.be.false;
    });
  });

  describe('visiting the resource page with single custom coverage', () => {
    beforeEach(async function () {
      const customCoverages = [
        await this.server.create('custom-coverage', {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
        })
      ];
      await resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}`);
      await ResourcePage.whenLoaded();
    });

    it('displays the customcoverage section for single date', () => {
      expect(ResourcePage.customCoverageList).to.equal('7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the resource page with single custom coverage (beginCoverage empty)', () => {
    beforeEach(async function () {
      resource.customCoverages = await this.server.createList('custom-coverage', 1, {
        beginCoverage: '',
        endCoverage: '1969-07-16'
      }).map(m => m.toJSON());
      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}`);
      await ResourcePage.whenLoaded();
    });

    it('display the custom coverage section for single date (end date only)', () => {
      expect(ResourcePage.customCoverageList).to.equal('7/16/1969');
    });
  });
  describe('visiting the resource show page with multiple custom coverage dates', () => {
    beforeEach(async function () {
      resource.customCoverages = [
        await this.server.create('custom-coverage', { beginCoverage: '1969-07-16', endCoverage: '1972-12-19' }),
        await this.server.create('custom-coverage', { beginCoverage: '1974-01-01', endCoverage: '1979-12-19' }),
      ].map(m => m.toJSON());
      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}`);
      await ResourcePage.whenLoaded();
    });

    it('displays date ranges comma separated and ordered by most recent coverage to least recent coverage', () => {
      expect(ResourcePage.customCoverageList).to.equal('1/1/1974 - 12/19/1979, 7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the resource page with custom coverage and year only publication type, multiple years', () => {
    beforeEach(async function () {
      title.publicationType = 'Audiobook';
      await title.save();

      resource.customCoverages = await this.server.createList('custom-coverage', 1, {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      }).map(m => m.toJSON());
      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}`);
      await ResourcePage.whenLoaded();
    });

    it('displays dates with YYYY format', () => {
      expect(ResourcePage.customCoverageList).to.equal('1969 - 1972');
    });
  });

  describe('visiting the resource page with custom coverage and year only publication type single year', () => {
    beforeEach(async function () {
      title.publicationType = 'Audiobook';
      await title.save();

      resource.customCoverages = await this.server.createList('custom-coverage', 1, {
        beginCoverage: '1969-01-01',
        endCoverage: '1969-05-01'
      }).map(m => m.toJSON());

      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}`);
      await ResourcePage.whenLoaded();
    });

    it('displays dates with YYYY format', () => {
      expect(ResourcePage.customCoverageList).to.equal('1969');
    });
  });

  describe('visiting the resource page with custom coverage and year only publication type missing end year', () => {
    beforeEach(async function () {
      title.publicationType = 'Audiobook';
      await title.save();

      resource.customCoverages = await this.server.createList('custom-coverage', 1, {
        beginCoverage: '1969-01-01',
        endCoverage: ''
      }).map(m => m.toJSON());

      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}`);
      await ResourcePage.whenLoaded();
    });

    it('displays dates with YYYY format', () => {
      expect(ResourcePage.customCoverageList).to.equal('1969');
    });
  });

  describe('visiting the resource page with custom coverage and year only publication type missing begin year', () => {
    beforeEach(async function () {
      title.publicationType = 'Audiobook';
      await title.save();

      resource.customCoverages = await this.server.createList('custom-coverage', 1, {
        beginCoverage: '',
        endCoverage: '1969-01-01'
      }).map(m => m.toJSON());

      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}`);
      await ResourcePage.whenLoaded();
    });

    it('displays dates with YYYY format', () => {
      expect(ResourcePage.customCoverageList).to.equal('1969');
    });
  });

  describe('visiting the resource page with custom coverage and year only publication type missing begin and end year', () => {
    beforeEach(async function () {
      title.publicationType = 'Audiobook';
      await title.save();

      resource.customCoverage = await this.server.createList('custom-coverage', 1, {
        beginCoverage: '',
        endCoverage: ''
      }).map(m => m.toJSON());

      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}`);
      await ResourcePage.whenLoaded();
    });

    it.always('does not display custom coverage list', () => {
      expect(ResourcePage.hasCustomCoverageList).to.be.false;
    });
  });
});

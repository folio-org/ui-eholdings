import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import ResourcePage from '../interactors/resource-show';

describe('ResourceCustomCoverage', () => {
  setupApplication();
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
    beforeEach(function () {
      resource.isSelected = false;
      resource.save();

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays message that resource needs to be selected', () => {
      expect(ResourcePage.isNotSelectedCoverageMessagePresent).to.be.true;
    });

    it('does not display custom coverage dates', () => {
      expect(ResourcePage.hasCustomCoverageList).to.be.false;
    });
  });

  describe('visiting a selected resource show page with custom coverage', () => {
    beforeEach(function () {
      const customCoverages = [
        this.server.create('custom-coverage', {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
        })
      ];
      resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays the date ranges', () => {
      expect(ResourcePage.customCoverageList).to.equal('7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the resource show page with empty (0 length) custom coverage array', () => {
    beforeEach(function () {
      resource.customCoverages = this.server.createList('custom-coverage', 0).map(m => m.toJSON());
      resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it.always('does not display the custom coverage section', () => {
      expect(ResourcePage.hasCustomCoverageList).to.be.false;
    });
  });

  describe('visiting the resource page with single custom coverage', () => {
    beforeEach(function () {
      const customCoverages = [
        this.server.create('custom-coverage', {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
        })
      ];
      resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays the customcoverage section for single date', () => {
      expect(ResourcePage.customCoverageList).to.equal('7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the resource page with single custom coverage (beginCoverage empty)', () => {
    beforeEach(function () {
      resource.customCoverages = this.server.createList('custom-coverage', 1, {
        beginCoverage: '',
        endCoverage: '1969-07-16'
      }).map(m => m.toJSON());
      resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('display the custom coverage section for single date (end date only)', () => {
      expect(ResourcePage.customCoverageList).to.equal('7/16/1969');
    });
  });
  describe('visiting the resource show page with multiple custom coverage dates', () => {
    beforeEach(function () {
      resource.customCoverages = [
        this.server.create('custom-coverage', { beginCoverage: '1969-07-16', endCoverage: '1972-12-19' }),
        this.server.create('custom-coverage', { beginCoverage: '1974-01-01', endCoverage: '1979-12-19' }),
      ].map(m => m.toJSON());
      resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays date ranges comma separated and ordered by most recent coverage to least recent coverage', () => {
      expect(ResourcePage.customCoverageList).to.equal('1/1/1974 - 12/19/1979, 7/16/1969 - 12/19/1972');
    });
  });

  describe('visiting the resource page with custom coverage and year only publication type, multiple years', () => {
    beforeEach(function () {
      title.publicationType = 'Audiobook';
      title.save();

      resource.customCoverages = this.server.createList('custom-coverage', 1, {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      }).map(m => m.toJSON());
      resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays dates with YYYY format', () => {
      expect(ResourcePage.customCoverageList).to.equal('1969 - 1972');
    });
  });

  describe('visiting the resource page with custom coverage and year only publication type single year', () => {
    beforeEach(function () {
      title.publicationType = 'Audiobook';
      title.save();

      resource.customCoverages = this.server.createList('custom-coverage', 1, {
        beginCoverage: '1969-01-01',
        endCoverage: '1969-05-01'
      }).map(m => m.toJSON());

      resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays dates with YYYY format', () => {
      expect(ResourcePage.customCoverageList).to.equal('1969');
    });
  });

  describe('visiting the resource page with custom coverage and year only publication type missing end year', () => {
    beforeEach(function () {
      title.publicationType = 'Audiobook';
      title.save();

      resource.customCoverages = this.server.createList('custom-coverage', 1, {
        beginCoverage: '1969-01-01',
        endCoverage: ''
      }).map(m => m.toJSON());

      resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays dates with YYYY format', () => {
      expect(ResourcePage.customCoverageList).to.equal('1969');
    });
  });

  describe('visiting the resource page with custom coverage and year only publication type missing begin year', () => {
    beforeEach(function () {
      title.publicationType = 'Audiobook';
      title.save();

      resource.customCoverages = this.server.createList('custom-coverage', 1, {
        beginCoverage: '',
        endCoverage: '1969-01-01'
      }).map(m => m.toJSON());

      resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays dates with YYYY format', () => {
      expect(ResourcePage.customCoverageList).to.equal('1969');
    });
  });

  describe('visiting the resource page with custom coverage and year only publication type missing begin and end year', () => {
    beforeEach(function () {
      title.publicationType = 'Audiobook';
      title.save();

      resource.customCoverage = this.server.createList('custom-coverage', 1, {
        beginCoverage: '',
        endCoverage: ''
      }).map(m => m.toJSON());

      resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it.always('does not display custom coverage list', () => {
      expect(ResourcePage.hasCustomCoverageList).to.be.false;
    });
  });
});

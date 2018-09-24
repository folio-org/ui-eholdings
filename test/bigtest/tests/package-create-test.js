import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from '../helpers/describe-application';
import PackageCreatePage from '../interactors/package-create';
import PackageShowPage from '../interactors/package-show';
import NavigationModal from '../interactors/navigation-modal';

describeApplication('PackageCreate', () => {
  beforeEach(function () {
    return this.visit('/eholdings/packages/new', () => {
      expect(PackageCreatePage.$root).to.exist;
    });
  });

  it('has a package name field', () => {
    expect(PackageCreatePage.hasName).to.be.true;
  });

  it('has a content-type field', () => {
    expect(PackageCreatePage.hasContentType).to.be.true;
  });

  it('content-type field is "Unknown" by default', () => {
    expect(PackageCreatePage.contentTypeValue).to.eq('Unknown');
  });

  it('has an add coverage button', () => {
    expect(PackageCreatePage.hasAddCoverageButton).to.be.true;
  });

  it('disables the save button', () => {
    expect(PackageCreatePage.isSaveDisabled).to.be.true;
  });

  describe('creating a new package', () => {
    beforeEach(() => {
      return PackageCreatePage
        .fillName('My Package')
        .save();
    });

    it('disables the save button', () => {
      expect(PackageCreatePage.isSaveDisabled).to.be.true;
    });

    it('redirects to the new package show page', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/packages\/\d{1,}/);
      expect(PackageShowPage.name).to.equal('My Package');
    });

    it('shows a success toast message', () => {
      expect(PackageShowPage.toast.successText).to.equal('Custom package created.');
    });
  });

  describe('creating a new package with a specified content type', () => {
    beforeEach(() => {
      return PackageCreatePage
        .fillName('My Package')
        .chooseContentType('Print')
        .save();
    });

    it('redirects to the new package with the specified content type', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/packages\/\d{1,}/);
      expect(PackageShowPage.contentType).to.equal('Print');
    });
  });

  describe('creating a new package with custom coverages', () => {
    beforeEach(() => {
      return PackageCreatePage
        .fillName('My Package')
        .addCoverage()
        .dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018')
        .save();
    });

    it('redirects to the new package with custom coverages', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/packages\/\d{1,}/);
      expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - 12/18/2018');
    });
  });

  describe.skip('clicking cancel', () => {
    beforeEach(() => {
      return PackageCreatePage.cancel();
    });

    it('redirects to the previous page', function () {
      expect(this.app.history.location.pathname).to.not.equal('/eholdings/packages/new');
    });
  });

  describe.skip('clicking cancel after filling in data', () => {
    beforeEach(() => {
      return PackageCreatePage
        .fillName('My Package')
        .cancel();
    });

    it('shows a navigations confirmation modal', () => {
      expect(NavigationModal.$root).to.exist;
    });
  });

  describe('getting an error when creating a new package', () => {
    beforeEach(function () {
      this.server.post('/packages', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return PackageCreatePage
        .fillName('My Package')
        .save();
    });

    it.always('does not create the new package', function () {
      expect(this.app.history.location.pathname).to.equal('/eholdings/packages/new');
    });

    it('shows an error toast message', () => {
      expect(PackageShowPage.toast.errorText).to.equal('There was an error');
    });

    it('enables the save button', () => {
      expect(PackageCreatePage.isSaveDisabled).to.be.false;
    });
  });
});

import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageCreatePage from '../interactors/package-create';
import PackageShowPage from '../interactors/package-show';
import PackageSearchPage from '../interactors/package-search';
import NavigationModal from '../interactors/navigation-modal';

describe('PackageCreate', () => {
  setupApplication();

  describe('submitting the form', () => {
    beforeEach(function () {
      this.visit('/eholdings/packages/new');
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

    it('does not have a back button', () => {
      expect(PackageCreatePage.hasBackButton).to.be.false;
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
        expect(this.location.pathname).to.match(/^\/eholdings\/packages\/\d{1,}/);
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
        expect(this.location.pathname).to.match(/^\/eholdings\/packages\/\d{1,}/);
        expect(PackageShowPage.contentType).to.equal('Print');
      });
    });

    describe('adding custom coverage', () => {
      beforeEach(async () => {
        await PackageCreatePage
          .fillName('My Package')
          .addCoverage();
      });

      it('does not display "Add date range" button when there is 1 date range row', () => {
        expect(PackageCreatePage.hasAddCoverageButton).to.be.false;
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
        expect(this.location.pathname).to.match(/^\/eholdings\/packages\/\d{1,}/);
        expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - 12/18/2018');
      });

      it('has not the add coverage button', () => {
        expect(PackageCreatePage.hasAddCoverageButton).to.be.false;
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
        expect(this.location.pathname).to.equal('/eholdings/packages/new');
      });

      it('shows an error toast message', () => {
        expect(PackageShowPage.toast.errorText).to.equal('There was an error');
      });

      it('enables the save button', () => {
        expect(PackageCreatePage.isSaveDisabled).to.be.false;
      });
    });
  });

  describe('closing when there is router history', () => {
    beforeEach(function () {
      this.visit('/eholdings/?searchType=packages');
    });

    describe('clicking a close button', () => {
      beforeEach(function () {
        return PackageSearchPage.clickNewButton();
      });

      describe('clicking close when pristine form', () => {
        beforeEach(() => {
          return PackageCreatePage.clickBackButton();
        });

        it('redirects to the previous page', function () {
          expect(this.location.pathname).to.not.equal('/eholdings/packages/new');
        });
      });

      describe('clicking close after filling in data', () => {
        beforeEach(() => {
          return PackageCreatePage
            .fillName('My Package')
            .clickBackButton();
        });

        it('shows a navigation confirmation modal', () => {
          expect(NavigationModal.$root).to.exist;
        });
      });
    });
  });
});

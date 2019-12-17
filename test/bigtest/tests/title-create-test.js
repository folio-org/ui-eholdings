import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import TitleCreatePage from '../interactors/title-create';
import TitleShowPage from '../interactors/title-show';
import TitleSearchPage from '../interactors/title-search';
import NavigationModal from '../interactors/navigation-modal';

describe.skip('TitleCreate', function () {
  setupApplication();
  // some of the beforeEach blocks seem to timeout in CI
  this.timeout(5000);
  let packages;

  describe('submitting the form', () => {
    beforeEach(async function () {
      packages = await this.server.createList('package', 2, {
        name: i => `Custom Package ${i + 1}`,
        provider: this.server.create('provider'),
        isCustom: true
      });

      this.visit('/eholdings/titles/new');
    });

    it('has a title name field', () => {
      expect(TitleCreatePage.hasName).to.be.true;
    });

    it('has an add contributor button', () => {
      expect(TitleCreatePage.hasContributorBtn).to.be.true;
    });

    it('has an edition field', () => {
      expect(TitleCreatePage.hasEdition).to.be.true;
    });

    it('has a publisher name field', () => {
      expect(TitleCreatePage.hasPublisher).to.be.true;
    });

    it('has a publication type field', () => {
      expect(TitleCreatePage.hasPublicationType).to.be.true;
      expect(TitleCreatePage.publicationType).to.equal('Unspecified');
    });

    it('has an add identifier button', () => {
      expect(TitleCreatePage.hasIdentifiersBtn).to.be.true;
    });

    it('has a description field', () => {
      expect(TitleCreatePage.hasDescription).to.be.true;
    });

    it('has a package select field', () => {
      expect(TitleCreatePage.hasPackageSelect).to.be.true;
      expect(TitleCreatePage.packagesCount).to.equal(2);
    });

    it('has a peer reviewed toggle', () => {
      expect(TitleCreatePage.hasPeerReviewed).to.be.true;
      expect(TitleCreatePage.isPeerReviewed).to.be.false;
    });

    it('disables the save button', () => {
      expect(TitleCreatePage.isSaveDisabled).to.be.true;
    });

    it('does not have a back button', () => {
      expect(TitleCreatePage.hasBackButton).to.be.false;
    });

    describe('creating a new title', () => {
      beforeEach(async () => {
        await TitleCreatePage.fillName('My Title');
        await TitleCreatePage.selectPackage(packages[0].name);
        await TitleCreatePage.save();
        await TitleShowPage.whenLoaded();
      });

      // TODO Refactor
      it.skip('disables the save button', () => {
        expect(TitleCreatePage.isSaveDisabled).to.be.true;
      });

      it('redirects to the new title show page', function () {
        expect(this.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
        expect(TitleShowPage.titleName).to.equal('My Title');
        expect(TitleShowPage.packageList(0).name).to.equal('Custom Package 1');
      });

      it('shows a success toast message', () => {
        expect(TitleShowPage.toast.successText).to.equal('Custom title created.');
      });
    });

    describe('creating a new title with a contributor', () => {
      beforeEach(async () => {
        await TitleCreatePage.fillName('My Title');
        await TitleCreatePage.clickAddContributor();
        await TitleCreatePage.contributorsRowList(0).type('author');
        await TitleCreatePage.contributorsRowList(0).contributor('Me'); // eslint-disable-line newline-per-chained-call
        await TitleCreatePage.selectPackage(packages[0].name);
        await TitleCreatePage.save();
      });
      it('goes to the title show page', () => {
        expect(TitleShowPage.$root).to.exist;
      });
      it('redirects to the new title show page with the specified contributor', function () {
        expect(TitleShowPage.contributorsList(0).contributorName).to.equal('Me');
        expect(TitleShowPage.contributorsList(0).contributorType).to.equal('Author');
      });
    });

    describe('creating a new title with an edition', () => {
      beforeEach(async () => {
        await TitleCreatePage.fillName('My Title');
        await TitleCreatePage.fillEdition('My Edition');
        await TitleCreatePage.selectPackage(packages[0].name);
        await TitleCreatePage.save();
      });

      it('redirects to the new title show page with the specified edition', function () {
        expect(this.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
        expect(TitleShowPage.edition).to.equal('My Edition');
      });
    });

    describe('creating a new title with a publisher', () => {
      beforeEach(async () => {
        await TitleCreatePage.fillName('My Title');
        await TitleCreatePage.fillPublisher('Me');
        await TitleCreatePage.selectPackage(packages[0].name);
        await TitleCreatePage.save();
      });

      it('redirects to the new title show page with the specified publisher', function () {
        expect(this.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
        expect(TitleShowPage.publisherName).to.equal('Me');
      });
    });

    describe('creating a new title with a specified publication type', () => {
      beforeEach(async () => {
        await TitleCreatePage.fillName('My Title');
        await TitleCreatePage.choosePublicationType('Book');
        await TitleCreatePage.selectPackage(packages[0].name);
        await TitleCreatePage.save();
      });

      it('redirects to the new package with the specified content type', function () {
        expect(this.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
        expect(TitleShowPage.publicationType).to.equal('Book');
      });
    });

    describe('creating a new title with an identifier', () => {
      beforeEach(async () => {
        await TitleCreatePage.fillName('My Title');
        await TitleCreatePage.addIdentifier('ISBN (Print)', '90210');
        await TitleCreatePage.selectPackage(packages[0].name);
        await TitleCreatePage.save();
      });

      it('redirects to the new title show page with the specified identifier', function () {
        expect(this.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
        expect(TitleShowPage.identifiersList(0).text).to.equal('ISBN (Print)90210');
      });
    });

    describe('creating a new title with a description', () => {
      beforeEach(async () => {
        await TitleCreatePage.fillName('My Title');
        await TitleCreatePage.fillDescription('This is my title');
        await TitleCreatePage.selectPackage(packages[0].name);
        await TitleCreatePage.save();
      });

      it('redirects to the new package with the specified description', function () {
        expect(this.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
        expect(TitleShowPage.descriptionText).to.equal('This is my title');
      });
    });

    describe('creating a new title with a different package', () => {
      beforeEach(async () => {
        await TitleCreatePage.fillName('My Title');
        await TitleCreatePage.selectPackage(packages[1].name);
        await TitleCreatePage.save();
      });

      it('redirects to the new package with the specified package', function () {
        expect(this.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
        expect(TitleShowPage.packageList(0).name).to.equal('Custom Package 2');
      });
    });

    describe('creating a new title and specifying peer reviewed status', () => {
      beforeEach(async () => {
        await TitleCreatePage.fillName('My Title');
        await TitleCreatePage.fillPublisher('Me');
        await TitleCreatePage.togglePeerReviewed();
        await TitleCreatePage.selectPackage(packages[0].name);
        await TitleCreatePage.save();
      });

      it('redirects to the new package with the specified content type', function () {
        expect(this.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
        expect(TitleShowPage.peerReviewedStatus).to.equal('Yes');
      });
    });

    describe('getting an error when creating a new title', () => {
      beforeEach(async function () {
        await this.server.post('/titles', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);

        await TitleCreatePage.fillName('My Title');
        await TitleCreatePage.selectPackage(packages[0].name);
        await TitleCreatePage.save();
      });

      it.always('does not create the title', function () {
        expect(this.location.pathname).to.equal('/eholdings/titles/new');
      });

      it('shows an error toast message', () => {
        expect(TitleShowPage.toast.errorText).to.equal('There was an error');
      });

      it('enables the save button', () => {
        expect(TitleCreatePage.isSaveDisabled).to.be.false;
      });
    });
  });

  describe('canceling when there is router history', () => {
    beforeEach(async function () {
      this.visit('/eholdings/?searchType=titles');
      await TitleSearchPage.whenLoaded();
    });

    describe('clicking a cancel action', () => {
      beforeEach(async function () {
        await TitleSearchPage.clickNewButton();
      });

      describe('clicking cancel', () => {
        beforeEach(async () => {
          await TitleCreatePage.cancel();
        });

        it('redirects to the previous page', function () {
          expect(this.location.pathname).to.not.equal('/eholdings/titles/new');
        });
      });

      describe('clicking cancel after filling in data', () => {
        beforeEach(async () => {
          await TitleCreatePage.fillName('My Title');
          await TitleCreatePage.cancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(NavigationModal.$root).to.exist;
        });
      });
    });
  });
});

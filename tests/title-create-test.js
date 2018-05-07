import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import TitleCreatePage from './pages/title-create';
import TitleShowPage from './pages/title-show';
import NavigationModal from './pages/navigation-modal';

describeApplication('TitleCreate', () => {
  let packages;

  beforeEach(function () {
    packages = this.server.createList('package', 2, {
      name: i => `Custom Package ${i + 1}`,
      provider: this.server.create('provider'),
      isCustom: true
    });

    return this.visit('/eholdings/titles/new', () => {
      expect(TitleCreatePage.$root).to.exist;
    });
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

  describe('creating a new title', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .selectPackage(packages[0].id)
        .save();
    });

    it('redirects to the new title show page', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.titleName).to.equal('My Title');
      expect(TitleShowPage.packageList(0).name).to.equal('Custom Package 1');
    });

    it('shows a success toast message', () => {
      expect(TitleShowPage.toast.successText).to.equal('Custom title created.');
    });
  });

  describe('creating a new title with a contributor', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .addContributor('author', 'Me')
        .selectPackage(packages[0].id)
        .save();
    });

    it('redirects to the new title show page with the specified contributor', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.contributorsList(0).text).to.equal('AuthorMe');
    });
  });

  describe('creating a new title with an edition', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .fillEdition('My Edition')
        .selectPackage(packages[0].id)
        .save();
    });

    it('redirects to the new title show page with the specified edition', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.edition).to.equal('My Edition');
    });
  });

  describe('creating a new title with a publisher', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .fillPublisher('Me')
        .selectPackage(packages[0].id)
        .save();
    });

    it('redirects to the new title show page with the specified publisher', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.publisherName).to.equal('Me');
    });
  });

  describe('creating a new title with a specified publication type', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .choosePublicationType('Book')
        .selectPackage(packages[0].id)
        .save();
    });

    it('redirects to the new package with the specified content type', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.publicationType).to.equal('Book');
    });
  });

  describe('creating a new title with an identifier', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .addIdentifier('ISBN (Print)', '90210')
        .selectPackage(packages[0].id)
        .save();
    });

    it('redirects to the new title show page with the specified identifier', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.identifiersList(0).text).to.equal('ISBN (Print)90210');
    });
  });

  describe('creating a new title with a description', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .fillDescription('This is my title')
        .selectPackage(packages[0].id)
        .save();
    });

    it('redirects to the new package with the specified description', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.descriptionText).to.equal('This is my title');
    });
  });

  describe('creating a new title with a different package', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .selectPackage(packages[1].id)
        .save();
    });

    it('redirects to the new package with the specified package', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.packageList(0).name).to.equal('Custom Package 2');
    });
  });

  describe('creating a new title and specifying peer reviewed status', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .fillPublisher('Me')
        .togglePeerReviewed()
        .selectPackage(packages[0].id)
        .save();
    });

    it('redirects to the new package with the specified content type', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.peerReviewedStatus).to.equal('Yes');
    });
  });

  describe('clicking cancel', () => {
    beforeEach(() => {
      return TitleCreatePage.cancel();
    });

    it('redirects to the previous page', function () {
      expect(this.app.history.location.pathname).to.not.equal('/eholdings/titles/new');
    });
  });

  describe('clicking cancel after filling in data', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .cancel();
    });

    it('shows a navigations confirmation modal', () => {
      expect(NavigationModal.$root).to.exist;
    });
  });

  describe('getting an error when creating a new title', () => {
    beforeEach(function () {
      this.server.post('/titles', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return TitleCreatePage
        .fillName('My Title')
        .selectPackage(packages[0].id)
        .save();
    });

    it.always('does not create the title', function () {
      expect(this.app.history.location.pathname).to.equal('/eholdings/titles/new');
    });

    it('shows an error toast message', () => {
      expect(TitleShowPage.toast.errorText).to.equal('There was an error');
    });
  });
});

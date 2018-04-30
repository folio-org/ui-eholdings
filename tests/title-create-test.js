import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import TitleCreatePage from './pages/title-create';
import TitleShowPage from './pages/title-show';
import NavigationModal from './pages/navigation-modal';

describeApplication('TitleCreate', () => {
  beforeEach(function () {
    return this.visit('/eholdings/titles/new', () => {
      expect(TitleCreatePage.$root).to.exist;
    });
  });

  it('has a title name field', () => {
    expect(TitleCreatePage.hasName).to.be.true;
  });

  it('has a publisher name field', () => {
    expect(TitleCreatePage.hasPublisher).to.be.true;
  });

  it('has a publication type field', () => {
    expect(TitleCreatePage.hasPublicationType).to.be.true;
    expect(TitleCreatePage.publicationType).to.equal('Unspecified');
  });

  it('has a description field', () => {
    expect(TitleCreatePage.hasDescription).to.be.true;
  });

  it('has a peer reviewed toggle', () => {
    expect(TitleCreatePage.hasPeerReviewed).to.be.true;
    expect(TitleCreatePage.isPeerReviewed).to.be.false;
  });

  describe('creating a new title', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .save();
    });

    it('redirects to the new title show page', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.titleName).to.equal('My Title');
    });

    it('shows a success toast message', () => {
      expect(TitleShowPage.toast.successText).to.equal('Custom title created.');
    });
  });

  describe('creating a new title with a publisher', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .fillPublisher('Me')
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
        .save();
    });

    it('redirects to the new package with the specified content type', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.publicationType).to.equal('Book');
    });
  });

  describe('creating a new title with a description', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .fillDescription('This is my title')
        .save();
    });

    it('redirects to the new package with the specified description', function () {
      expect(this.app.history.location.pathname).to.match(/^\/eholdings\/titles\/\d{1,}/);
      expect(TitleShowPage.descriptionText).to.equal('This is my title');
    });
  });

  describe('creating a new title and specifying peer reviewed status', () => {
    beforeEach(() => {
      return TitleCreatePage
        .fillName('My Title')
        .fillPublisher('Me')
        .togglePeerReviewed()
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

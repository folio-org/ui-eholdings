import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import TitleShowPage from '../interactors/title-show';

describe('TitleShow', () => {
  setupApplication();
  let title,
    resources;

  beforeEach(function () {
    title = this.server.create('title', 'withPackages', {
      name: 'Cool Title',
      edition: 'Cool Edition',
      publisherName: 'Cool Publisher',
      publicationType: 'Website'
    });

    title.subjects = [
      this.server.create('subject', { subject: 'Cool Subject 1' }),
      this.server.create('subject', { subject: 'Cool Subject 2' }),
      this.server.create('subject', { subject: 'Cool Subject 3' })
    ].map(m => m.toJSON());

    title.identifiers = [
      this.server.create('identifier', { type: 'ISBN', subtype: 'Print', id: '978-0547928210' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Print', id: '978-0547928203' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Online', id: '978-0547928197' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Empty', id: '978-0547928227' }),
      this.server.create('identifier', { type: 'Mid', subtype: 'someothersubtype', id: 'someothertypeofid' })
    ].map(m => m.toJSON());

    title.contributors = [
      this.server.create('contributor', { type: 'author', contributor: 'Writer, Sally' }),
      this.server.create('contributor', { type: 'author', contributor: 'Wordsmith, Jane' }),
      this.server.create('contributor', { type: 'illustrator', contributor: 'Artist, John' })
    ].map(m => m.toJSON());

    title.save();

    resources = title.resources.models;
  });

  describe('visiting the title page', () => {
    beforeEach(function () {
      this.visit(`/eholdings/titles/${title.id}`);
    });

    it('displays the title name in the pane header', () => {
      expect(TitleShowPage.paneTitle).to.equal('Cool Title');
    });

    it('displays the title name', () => {
      expect(TitleShowPage.titleName).to.equal('Cool Title');
    });

    it.always('does not display the edit button for a managed title', () => {
      expect(TitleShowPage.hasEditButton).to.be.false;
    });

    it('displays the collapse all button', () => {
      expect(TitleShowPage.hasCollapseAllButton).to.be.true;
    });

    it('displays the edition', () => {
      expect(TitleShowPage.edition).to.equal('Cool Edition');
    });

    it('displays the publisher name', () => {
      expect(TitleShowPage.publisherName).to.equal('Cool Publisher');
    });

    it('displays the publication type', () => {
      expect(TitleShowPage.publicationType).to.equal('Website');
    });

    it('groups together identifiers of the same type and subtype', () => {
      expect(TitleShowPage.identifiersList(0).text).to.equal('ISBN (Print)978-0547928210, 978-0547928203');
    });

    it('does not group together identifiers of the same type, but not the same subtype', () => {
      expect(TitleShowPage.identifiersList(1).text).to.equal('ISBN (Online)978-0547928197');
    });

    it('does not show a subtype for an identifier when none exists', () => {
      expect(TitleShowPage.identifiersList(2).text).to.equal('ISBN978-0547928227');
    });

    it('does not show identifiers that are not ISSN or ISBN', () => {
      expect(TitleShowPage.identifiersList().length).to.equal(3);
    });

    it('displays the authors', () => {
      expect(TitleShowPage.contributorsList(0).text).to.equal('AuthorsWriter, Sally; Wordsmith, Jane');
    });

    it('displays the illustrator', () => {
      expect(TitleShowPage.contributorsList(1).text).to.equal('IllustratorArtist, John');
    });

    it('does not display an editor', () => {
      expect(TitleShowPage.contributorsList()[2]).to.be.undefined;
    });

    it('displays the subjects list', () => {
      expect(TitleShowPage.subjectsList).to.equal('Cool Subject 1; Cool Subject 2; Cool Subject 3');
    });

    it('displays a list of resources', () => {
      expect(TitleShowPage.packageList()).to.have.lengthOf(resources.length);
    });

    it('displays name of a package in the resource list', () => {
      expect(TitleShowPage.packageList(0).name).to.equal(resources[0].package.name);
    });

    it('displays whether the first resource is selected', () => {
      expect(TitleShowPage.packageList(0).isSelected).to.equal(resources[0].isSelected);
    });

    it('should display back (close) button', () => {
      expect(TitleShowPage.hasBackButton).to.be.true;
    });

    describe('clicking the collapse all button', () => {
      beforeEach(() => {
        return TitleShowPage.clickCollapseAllButton();
      });

      it('toggles the button text to expand all', () => {
        expect(TitleShowPage.collapseAllButtonText).to.equal('Expand all');
      });
    });
  });

  describe('navigating to title page', () => {
    beforeEach(function () {
      this.visit({
        pathname: `/eholdings/titles/${title.id}`,
        // our internal link component automatically sets the location state
        state: { eholdings: true }
      });
    });

    it('should display the back button in UI', () => {
      expect(TitleShowPage.hasBackButton).to.be.true;
    });
  });

  describe('visiting the title page with some attributes undefined', () => {
    beforeEach(async function () {
      title = this.server.create('title', {
        name: 'Cool Title',
        edition: 'Cool Edition',
        publisherName: 'Cool Publisher',
        publicationType: ''
      });

      title.save();
      resources = title.resources.models;
      this.visit(`/eholdings/titles/${title.id}`);
      await TitleShowPage.whenLoaded();
    });

    it('displays the title name', () => {
      expect(TitleShowPage.titleName).to.equal('Cool Title');
    });

    it('displays the edition', () => {
      expect(TitleShowPage.edition).to.equal('Cool Edition');
    });

    it('displays the publisher name', () => {
      expect(TitleShowPage.publisherName).to.equal('Cool Publisher');
    });

    describe('the page always', () => {
      beforeEach(async function () {
        await TitleShowPage.whenLoaded();
      });

      it.always('does not display the publication type', () => {
        expect(TitleShowPage.hasPublicationType).to.be.false;
      });

      it.always('does not display identifiers', () => {
        expect(TitleShowPage.identifiersList().length).to.equal(0);
      });

      it.always('does not display contributors', () => {
        expect(TitleShowPage.contributorsList().length).to.equal(0);
      });

      it.always('does not display package list', () => {
        expect(TitleShowPage.packageList().length).to.equal(0);
      });

      it.always('does not display subjects list', () => {
        expect(TitleShowPage.hasSubjectsList).to.be.false;
      });
    });
  });

  describe('visiting the title page with unknown attribute values', () => {
    beforeEach(function () {
      title = this.server.create('title', {
        name: 'Cool Title',
        edition: 'Cool Edition',
        publisherName: 'Cool Publisher',
        publicationType: 'UnknownPublicationType'
      });

      title.save();
      resources = title.resources.models;
      this.visit(`/eholdings/titles/${title.id}`);
    });

    it('displays the title name', () => {
      expect(TitleShowPage.titleName).to.equal('Cool Title');
    });

    it('displays the edition', () => {
      expect(TitleShowPage.edition).to.equal('Cool Edition');
    });

    it('displays the publisher name', () => {
      expect(TitleShowPage.publisherName).to.equal('Cool Publisher');
    });

    it('displays publication type without modification', () => {
      expect(TitleShowPage.publicationType).to.equal('UnknownPublicationType');
    });

    describe('the page always', () => {
      beforeEach(async function () {
        await TitleShowPage.whenLoaded();
      });

      it.always('does not display identifiers', () => {
        expect(TitleShowPage.hasIdentifiersList).to.be.false;
      });

      it.always('does not display contributors', () => {
        expect(TitleShowPage.contributorsList().length).to.equal(0);
      });

      it.always('does not display package list', () => {
        expect(TitleShowPage.packageList().length).to.equal(0);
      });

      it.always('does not display subjects list', () => {
        expect(TitleShowPage.hasSubjectsList).to.be.false;
      });
    });
  });

  describe('visiting the title details page with multiple pages of packages', () => {
    beforeEach(function () {
      this.server.loadFixtures();

      this.visit('/eholdings/titles/paged_title');
    });

    it('should display the first page of related packages', () => {
      expect(TitleShowPage.packageList(0).name).to.equal('Title Package 1');
    });

    describe.skip('scrolling down the list of packages', () => {
      beforeEach(() => {
        return TitleShowPage.scrollToPackageOffset(26);
      });

      it('should display the next page of related packages', () => {
        // when the list is scrolled, it has a threshold of 5 items. index 4,
        // the 5th item, is the topmost visible item in the list
        expect(TitleShowPage.packageList(4).name).to.equal('Title Package 26');
      });
    });
  });

  describe('viewing a custom title', () => {
    beforeEach(function () {
      title = this.server.create('title', {
        name: 'Cool Title',
        edition: 'Cool Edition',
        publisherName: 'Cool Publisher',
        publicationType: 'UnknownPublicationType',
        isTitleCustom: true
      });

      this.visit(`/eholdings/titles/${title.id}`);
    });

    it('displays the edit button for a custom title', () => {
      expect(TitleShowPage.hasEditButton).to.be.true;
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/titles/:titleId', [{
        message: 'There was an error',
        code: '1000',
        subcode: 0
      }], 500);

      this.visit(`/eholdings/titles/${title.titleId}`);
    });

    it('displays the correct error text', () => {
      expect(TitleShowPage.toast.errorText).to.equal('An unknown error occurred');
    });

    it('only has one error', () => {
      expect(TitleShowPage.toast.errorToastCount).to.equal(1);
      expect(TitleShowPage.toast.totalToastCount).to.equal(1);
    });

    it('is positioned to the bottom', () => {
      expect(TitleShowPage.toast.isPositionedBottom).to.be.true;
      expect(TitleShowPage.toast.isPositionedTop).to.be.false;
    });

    it('dies with dignity', () => {
      expect(TitleShowPage.hasErrors).to.be.true;
    });
  });
});

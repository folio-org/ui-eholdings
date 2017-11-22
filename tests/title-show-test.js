/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import TitleShowPage from './pages/title-show';

describeApplication('TitleShow', () => {
  let title,
    customerResources;

  beforeEach(function () {
    title = this.server.create('title', 'withPackages', {
      titleName: 'Cool Title',
      publisherName: 'Cool Publisher',
      pubType: 'website'
    });

    title.subjects = [
      this.server.create('subject', { subject: 'Cool Subject 1' }),
      this.server.create('subject', { subject: 'Cool Subject 2' }),
      this.server.create('subject', { subject: 'Cool Subject 3' })
    ];
    title.identifiers = [
      this.server.create('identifier', { type: 1, subtype: 1, id: '978-0547928210' }),
      this.server.create('identifier', { type: 1, subtype: 1, id: '978-0547928203' }),
      this.server.create('identifier', { type: 1, subtype: 2, id: '978-0547928197' }),
      this.server.create('identifier', { type: 1, subtype: 0, id: '978-0547928227' }),
      this.server.create('identifier', { type: 8, subtype: 49, id: 'someothertypeofid' })
    ];
    title.contributors = [
      this.server.create('contributor', { type: 'author', contributor: 'Writer, Sally' }),
      this.server.create('contributor', { type: 'author', contributor: 'Wordsmith, Jane' }),
      this.server.create('contributor', { type: 'illustrator', contributor: 'Artist, John' })
    ];
    title.save();

    customerResources = title.customerResources.models;
  });

  describe('visiting the title page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/titles/${title.id}`, () => {
        expect(TitleShowPage.$root).to.exist;
      });
    });

    it('displays the title name', () => {
      expect(TitleShowPage.titleName).to.equal('Cool Title');
    });

    it('displays the publisher name', () => {
      expect(TitleShowPage.publisherName).to.equal('Cool Publisher');
    });

    it('displays the publication type', () => {
      expect(TitleShowPage.publicationType).to.equal('Website');
    });

    it('groups together identifiers of the same type and subtype', () => {
      expect(TitleShowPage.identifiersList[0]).to.equal('ISBN (Print)978-0547928210 978-0547928203');
    });

    it('does not group together identifiers of the same type, but not the same subtype', () => {
      expect(TitleShowPage.identifiersList[1]).to.equal('ISBN (Online)978-0547928197');
    });

    it('does not show a subtype for an identifier when none exists', () => {
      expect(TitleShowPage.identifiersList[2]).to.equal('ISBN978-0547928227');
    });

    it('does not show identifiers that are not ISSN or ISBN', () => {
      expect(TitleShowPage.identifiersList.length).to.equal(3);
    });

    it('displays the authors', () => {
      expect(TitleShowPage.contributorsList[0]).to.equal('AuthorsWriter, Sally; Wordsmith, Jane');
    });

    it('displays the illustrator', () => {
      expect(TitleShowPage.contributorsList[1]).to.equal('IllustratorArtist, John');
    });

    it('does not display an editor', () => {
      expect(TitleShowPage.contributorsList[2]).to.be.undefined;
    });

    it('displays the subjects list', () => {
      expect(TitleShowPage.subjectsList).to.equal('Cool Subject 1; Cool Subject 2; Cool Subject 3');
    });

    it('displays a list of customer resources', () => {
      expect(TitleShowPage.packageList).to.have.lengthOf(customerResources.length);
    });

    it('displays name of a package in the customer resource list', () => {
      expect(TitleShowPage.packageList[0].name).to.equal(customerResources[0].package.packageName);
    });

    it('displays whether the first customer resource is selected', () => {
      expect(TitleShowPage.packageList[0].isSelected).to.equal(customerResources[0].isSelected);
    });

    it.still('should not display back button', () => {
      expect(TitleShowPage.$backButton).to.not.exist;
    });
  });

  describe('navigating to title page', () => {
    beforeEach(function () {
      return this.visit({
        pathname: `/eholdings/titles/${title.id}`,
        // our internal link component automatically sets the location state
        state: { eholdings: true }
      }, () => {
        expect(TitleShowPage.$root).to.exist;
      });
    });

    it('should display the back button in UI', () => {
      expect(TitleShowPage.$backButton).to.exist;
    });
  });

  describe('visiting the title page with some attributes undefined', () => {
    beforeEach(function () {
      title = this.server.create('title', 'withPackages', {
        titleName: 'Cool Title',
        publisherName: 'Cool Publisher',
        pubType: ''
      });
      title.subjects = [
      ];
      title.identifiers = [
      ];
      title.contributors = [
      ];
      title.save();
      customerResources = title.customerResources.models;
      return this.visit(`/eholdings/titles/${title.id}`, () => {
        expect(TitleShowPage.$root).to.exist;
      });
    });

    it('displays the title name', () => {
      expect(TitleShowPage.titleName).to.equal('Cool Title');
    });

    it('displays the publisher name', () => {
      expect(TitleShowPage.publisherName).to.equal('Cool Publisher');
    });

    it('does not displays the publication type', () => {
      expect(TitleShowPage.publicationType).to.equal('');
    });

    it('does not display identifiers', () => {
      expect(TitleShowPage.identifiersList.length).to.equal(0);
    });
    it('does not display contributors', () => {
      expect(TitleShowPage.contributorsList.length).to.equal(0);
    });
    it('does not display package list', () => {
      expect(TitleShowPage.packageList.length).to.equal(0);
    });
    it('does not display subjects list', () => {
      expect(TitleShowPage.subjectsList.length).to.equal(0);
    });
  });

  describe('visiting the title page with unknown attribute values', () => {
    beforeEach(function () {
      title = this.server.create('title', 'withPackages', {
        titleName: 'Cool Title',
        publisherName: 'Cool Publisher',
        pubType: 'UnknownPublicationType'
      });
      title.save();
      customerResources = title.customerResources.models;
      return this.visit(`/eholdings/titles/${title.id}`, () => {
        expect(TitleShowPage.$root).to.exist;
      });
    });

    it('displays the title name', () => {
      expect(TitleShowPage.titleName).to.equal('Cool Title');
    });

    it('displays the publisher name', () => {
      expect(TitleShowPage.publisherName).to.equal('Cool Publisher');
    });

    it('displays publication type without modification', () => {
      expect(TitleShowPage.publicationType).to.equal('UnknownPublicationType');
    });

    it('does not display identifiers', () => {
      expect(TitleShowPage.identifiersList.length).to.equal(0);
    });
    it('does not display contributors', () => {
      expect(TitleShowPage.contributorsList.length).to.equal(0);
    });
    it('does not display package list', () => {
      expect(TitleShowPage.packageList.length).to.equal(0);
    });
    it('does not display subjects list', () => {
      expect(TitleShowPage.subjectsList.length).to.equal(0);
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/titles/:titleId', [{
        message: 'There was an error',
        code: '1000',
        subcode: 0
      }], 500);

      return this.visit(`/eholdings/titles/${title.titleId}`, () => {
        expect(TitleShowPage.$root).to.exist;
      });
    });

    it('dies with dignity', () => {
      expect(TitleShowPage.hasErrors).to.be.true;
    });
  });
});

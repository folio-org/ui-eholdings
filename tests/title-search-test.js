/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import TitleSearchPage from './pages/title-search';

describeApplication('TitleSearch', () => {
  beforeEach(function () {
    this.server.createList('title', 3, {
      titleName: i => `Title${i + 1}`
    });

    return this.visit('/eholdings/search/titles', () => {
      expect(TitleSearchPage.$root).to.exist;
    });
  });

  it('has a searchbox', () => {
    expect(TitleSearchPage.$searchField).to.exist;
  });

  describe('searching for a title', () => {
    beforeEach(() => {
      TitleSearchPage.search('Title');
    });

    it("displays title entries related to 'Title'", () => {
      expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
    });

    describe('filtering the search results further', () => {
      beforeEach(() => {
        TitleSearchPage.search('Title1');
      });

      it('only shows a single result', () => {
        expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(1);
      });
    });
  });

  describe("searching for the title 'fhqwhgads'", () => {
    beforeEach(() => {
      TitleSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", () => {
      expect(TitleSearchPage.noResultsMessage).to.equal('No titles found for "fhqwhgads".');
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/titles', [{
        message: 'There was an error',
        code: '1000',
        subcode: 0
      }], 500);

      TitleSearchPage.search("this doesn't matter");
    });

    it('dies with dignity', () => {
      expect(TitleSearchPage.hasErrors).to.be.true;
    });
  });
});

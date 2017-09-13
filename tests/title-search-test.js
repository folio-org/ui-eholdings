/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import TitleSearchPage from './pages/title-search';

describeApplication('TitleSearch', function() {
  beforeEach(function() {
    this.server.createList('title', 3, {
      titleName: (i) => `Title${i + 1}`
    });

    return this.visit('/eholdings/search/titles', () => {
      expect(TitleSearchPage.$root).to.exist;
    });
  });

  it('has a searchbox', function() {
    expect(TitleSearchPage.$searchField).to.exist;
  });

  describe("searching for a title", function() {
    beforeEach(function() {
      TitleSearchPage.search('Title');
    });

    it("displays title entries related to 'Title'", function() {
      expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
    });

    describe("filtering the search results further", function() {
      beforeEach(function() {
        TitleSearchPage.search('Title1');
      });

      it("only shows a single result", function() {
        expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(1);
      });
    });
  });

  describe("searching for the title 'fhqwhgads'", function() {
    beforeEach(function() {
      TitleSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", function() {
      expect(TitleSearchPage.noResultsMessage).to.equal('No titles found for "fhqwhgads".');
    });
  });

  describe("encountering a server error", function() {
    beforeEach(function() {
      this.server.get('/titles', [{
        message: 'There was an error',
        code: "1000",
        subcode: 0
      }], 500);

      TitleSearchPage.search("this doesn't matter");
    });

    it("dies with dignity", function() {
      expect(TitleSearchPage.hasErrors).to.be.true;
    });
  });
});

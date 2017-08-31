/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import SearchTitlesPage from './pages/search-titles';

describeApplication('eHoldings', function() {
  beforeEach(function() {
    this.server.createList('title', 3, {
      titleName: (i) => `Title${i + 1}`
    });

    return this.visit('/eholdings/titles', () => {
      expect(SearchTitlesPage.$root).to.exist;
    });
  });

  it('has a searchbox', function() {
    expect(SearchTitlesPage.$searchField).to.exist;
  });

  describe("searching for a title", function() {
    beforeEach(function() {
      SearchTitlesPage.search('Title');
    });

    it("displays title entries related to 'Title'", function() {
      expect(SearchTitlesPage.$searchResultsItems).to.have.lengthOf(3);
    });

    describe("filtering the search results further", function() {
      beforeEach(function() {
        SearchTitlesPage.search('Title1');
      });

      it("only shows a single result", function() {
        expect(SearchTitlesPage.$searchResultsItems).to.have.lengthOf(1);
      });
    });
  });

  describe("searching for the title 'fhqwhgads'", function() {
    beforeEach(function() {
      SearchTitlesPage.search('fhqwhgads');
    });

    it("displays 'no results' message", function() {
      expect(SearchTitlesPage.noResultsMessage).to.equal('No results found for "fhqwhgads".');
    });
  });
});

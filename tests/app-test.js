/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import AppPage from './pages/app';

describeApplication('eHoldings', function() {
  beforeEach(function() {
    this.server.createList('vendor', 3, {
      vendorName: (i) => `Vendor${i + 1}`
    });
  });

  it('has a searchbox with options to search for vendor, package and title', function() {
    expect(AppPage.searchField).to.exist;
  });

  describe("searching for a vendor", function() {
    beforeEach(function() {
      AppPage.search('Vendor');
    });

    it("displays vendor entries related to 'Vendor'", function() {
      expect(AppPage.searchResultsItems).to.have.lengthOf(3);
    });

    it("displays the name, number of packages available, and packages subscribed to for each vendor");

    describe("filtering the search results further", function() {
      beforeEach(function() {
        AppPage.search('Vendor1');
      });

      it("only shows a single result", function() {
        expect(AppPage.searchResultsItems).to.have.lengthOf(1);
      });
    });

    describe("clicking on a result", function() {
      it("shows vendor details");
      it("shows packages for vendor");
    });

    describe("sorting by name", function() {
      it("sorts by name");
    });
  });

  describe("searching for the vendor 'fhqwhgads'", function() {
    beforeEach(function() {
      AppPage.search('fhqwhgads');
    });

    it("displays 'no results' message", function() {
      expect(AppPage.noResultsMessage).to.equal('No results found for "fhqwhgads".');
    });
  });

  describe("encountering a server error", function() {
    beforeEach(function() {
      this.server.get('/vendors', [{
        message: 'There was an error',
        code: "1000",
        subcode: 0
      }], 500);

      AppPage.search("this doesn't matter");
    });

    it("dies with dignity", function() {
      expect(AppPage.hasErrors).to.be.true;
    });
  });
});

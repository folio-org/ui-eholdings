/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import SearchVendorsPage from './pages/search-vendors';

describeApplication('eHoldings', function() {
  beforeEach(function() {
    this.server.createList('vendor', 3, {
      vendorName: (i) => `Vendor${i + 1}`
    });

    return this.visit('/eholdings/vendors', () => {
      expect(SearchVendorsPage.$root).to.exist;
    });
  });

  it('has a searchbox', function() {
    expect(SearchVendorsPage.$searchField).to.exist;
  });

  describe("searching for a vendor", function() {
    beforeEach(function() {
      SearchVendorsPage.search('Vendor');
    });

    it("displays vendor entries related to 'Vendor'", function() {
      expect(SearchVendorsPage.$searchResultsItems).to.have.lengthOf(3);
    });

    it("displays the name, number of packages available, and packages subscribed to for each vendor");

    describe("filtering the search results further", function() {
      beforeEach(function() {
        SearchVendorsPage.search('Vendor1');
      });

      it("only shows a single result", function() {
        expect(SearchVendorsPage.$searchResultsItems).to.have.lengthOf(1);
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
      SearchVendorsPage.search('fhqwhgads');
    });

    it("displays 'no results' message", function() {
      expect(SearchVendorsPage.noResultsMessage).to.equal('No results found for "fhqwhgads".');
    });
  });

  describe.skip("encountering a server error", function() {
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

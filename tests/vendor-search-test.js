/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import VendorSearchPage from './pages/vendor-search';

describeApplication('VendorSearch', function() {
  beforeEach(function() {
    this.server.createList('vendor', 3, {
      vendorName: (i) => `Vendor${i + 1}`
    });

    return this.visit('/eholdings/search/vendors', () => {
      expect(VendorSearchPage.$root).to.exist;
    });
  });

  it('has a searchbox', function() {
    expect(VendorSearchPage.$searchField).to.exist;
  });

  describe("searching for a vendor", function() {
    beforeEach(function() {
      VendorSearchPage.search('Vendor');
    });

    it("displays vendor entries related to 'Vendor'", function() {
      expect(VendorSearchPage.$searchResultsItems).to.have.lengthOf(3);
    });

    it("displays the name, number of packages available, and packages subscribed to for each vendor");

    describe("filtering the search results further", function() {
      beforeEach(function() {
        VendorSearchPage.search('Vendor1');
      });

      it("only shows a single result", function() {
        expect(VendorSearchPage.$searchResultsItems).to.have.lengthOf(1);
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
      VendorSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", function() {
      expect(VendorSearchPage.noResultsMessage).to.equal('No vendors found for "fhqwhgads".');
    });
  });

  describe("encountering a server error", function() {
    beforeEach(function() {
      this.server.get('/vendors', [{
        message: 'There was an error',
        code: "1000",
        subcode: 0
      }], 500);

      VendorSearchPage.search("this doesn't matter");
    });

    it("dies with dignity", function() {
      expect(VendorSearchPage.hasErrors).to.be.true;
    });
  });
});

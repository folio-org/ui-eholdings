/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import PackageSearchPage from './pages/package-search';

describeApplication('PackageSearch', function() {
  beforeEach(function() {
    this.server.createList('package', 3, 'withVendor', {
      packageName: (i) => `Package${i + 1}`
    });

    return this.visit('/eholdings/search/packages', () => {
      expect(PackageSearchPage.$root).to.exist;
    });
  });

  it('has a searchbox', function() {
    expect(PackageSearchPage.$searchField).to.exist;
  });

  describe("searching for a package", function() {
    beforeEach(function() {
      PackageSearchPage.search('Package');
    });

    it("displays package entries related to 'Package'", function() {
      expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
    });

    describe("filtering the search results further", function() {
      beforeEach(function() {
        PackageSearchPage.search('Package1');
      });

      it("only shows a single result", function() {
        expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(1);
      });
    });
  });

  describe("searching for the package 'fhqwhgads'", function() {
    beforeEach(function() {
      PackageSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", function() {
      expect(PackageSearchPage.noResultsMessage).to.equal('No packages found for "fhqwhgads".');
    });
  });

  describe("encountering a server error", function() {
    beforeEach(function() {
      this.server.get('/packages', [{
        message: 'There was an error',
        code: "1000",
        subcode: 0
      }], 500);

      PackageSearchPage.search("this doesn't matter");
    });

    it("dies with dignity", function() {
      expect(PackageSearchPage.hasErrors).to.be.true;
    });
  });
});

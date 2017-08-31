/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import SearchPackagesPage from './pages/search-packages';

describeApplication('eHoldings', function() {
  beforeEach(function() {
    this.server.createList('package', 3, 'withVendor', {
      packageName: (i) => `Package${i + 1}`
    });

    return this.visit('/eholdings/packages', () => {
      expect(SearchPackagesPage.$root).to.exist;
    });
  });

  it('has a searchbox', function() {
    expect(SearchPackagesPage.$searchField).to.exist;
  });

  describe("searching for a package", function() {
    beforeEach(function() {
      SearchPackagesPage.search('Package');
    });

    it("displays package entries related to 'Package'", function() {
      expect(SearchPackagesPage.$searchResultsItems).to.have.lengthOf(3);
    });

    describe("filtering the search results further", function() {
      beforeEach(function() {
        SearchPackagesPage.search('Package1');
      });

      it("only shows a single result", function() {
        expect(SearchPackagesPage.$searchResultsItems).to.have.lengthOf(1);
      });
    });
  });

  describe("searching for the package 'fhqwhgads'", function() {
    beforeEach(function() {
      SearchPackagesPage.search('fhqwhgads');
    });

    it("displays 'no results' message", function() {
      expect(SearchPackagesPage.noResultsMessage).to.equal('No results found for "fhqwhgads".');
    });
  });
});

/* global describe, beforeEach */
import { expect } from 'chai';
import it, { convergeOn } from './it-will';

import { describeApplication } from './helpers';
import PackageSearchPage from './pages/package-search';

describeApplication('PackageSearch', () => {
  beforeEach(function () {
    this.server.createList('package', 3, 'withVendor', {
      packageName: i => `Package${i + 1}`
    });

    this.server.create('package', 'withVendor', {
      packageName: 'SomethingElse'
    });

    return this.visit('/eholdings/?searchType=packages', () => {
      expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(4);
    });
  });

  it('has a searchbox', () => {
    expect(PackageSearchPage.$searchField).to.exist;
  });

  describe('searching for a package', () => {
    beforeEach(() => {
      PackageSearchPage.search('Package');
    });

    it("displays package entries related to 'Package'", () => {
      expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
    });

    describe('filtering the search results further', () => {
      beforeEach(() => {
        PackageSearchPage.search('Package1');
      });

      it('only shows a single result', () => {
        expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(1);
      });
    });

    describe('clicking another search type', () => {
      beforeEach(() => {
        return convergeOn(() => {
          // wait for the previous search to complete
          expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => PackageSearchPage.changeSearchType('titles'));
      });

      it('displays an empty search', () => {
        expect(PackageSearchPage.$searchField).to.have.value('');
      });

      it('does not display any more results', () => {
        expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(0);
      });

      describe('navigating back to packages search', () => {
        beforeEach(() => {
          return PackageSearchPage.changeSearchType('packages');
        });

        it('displays the original search', () => {
          expect(PackageSearchPage.$searchField).to.have.value('Package');
        });

        it('displays the original search results', () => {
          expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
        });
      });
    });
  });

  describe("searching for the package 'fhqwhgads'", () => {
    beforeEach(() => {
      PackageSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", () => {
      expect(PackageSearchPage.noResultsMessage).to.equal('No packages found for "fhqwhgads".');
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/packages', [{
        message: 'There was an error',
        code: '1000',
        subcode: 0
      }], 500);

      PackageSearchPage.search("this doesn't matter");
    });

    it('dies with dignity', () => {
      expect(PackageSearchPage.hasErrors).to.be.true;
    });
  });
});
